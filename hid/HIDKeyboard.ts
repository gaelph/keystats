import { EventEmitter } from "events";
import HID from "node-hid";
import log from "loglevel";

import HIDMessage from "./HIDMessage.js";
import HIDCommand from "./Command.js";
import {
  CmdGetLayersMetadata,
  CmdGetLayersMetadataResponse,
} from "./CmdGetLayersMetadata.js";
import { CmdGetLayers, CmdGetLayersResponse } from "./CmdGetLayers.js";
import { HID_EVENT, HID_CMD_UNKNOWN } from "./constants.js";

export type HIDCallback = (_messages: HIDMessage[]) => void;

export interface LayerMetadata {
  numberOfLayers: number;
  matrixCols: number;
  matrixRows: number;
}

const MAX_CALL_ID = 0xffff;
let currentCallId = 0;

/**
 * An async function that waits for n milliseconds
 */
function wait(n: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), n);
  });
}

/**
 * Returns the next available `callId`. Since call ids are 16-bit integers,
 * when reaching the highest value, we go back to 0.
 * This allows for 65536 simultaneous calls. Overkill
 */
function nextCallId(): number {
  if (currentCallId == MAX_CALL_ID) {
    currentCallId = 0;
  } else {
    currentCallId++;
  }

  return currentCallId;
}

/**
 * High level interface for interacting with a HID keyboard.
 */
export default class HIDKeyboard extends EventEmitter {
  hidDevice: HID.HID;
  logger = log.getLogger("HIDKeyboard");
  messagePool: Map<string, HIDMessage[]> = new Map();
  callbacks: Map<number, HIDCallback> = new Map();

  constructor(hidDevice: HID.HID) {
    super();

    this.hidDevice = hidDevice;
    this._setupHandler();
    this.hidDevice.resume();
  }

  private _setupHandler() {
    this.hidDevice.on("error", (error) => {
      this.logger.error(error);
    });

    this.hidDevice.on("data", (data) => {
      try {
        const message = new HIDMessage(data);

        // store the message in the message pool
        const poolKey = `${message.cmd}_${message.callId}`;
        if (!this.messagePool.has(poolKey)) {
          this.messagePool.set(poolKey, []);
        }
        const messages = this.messagePool.get(poolKey);
        if (!messages) return;

        messages.push(message);

        // when all messages for the same call response have been received
        if (messages.length == message.totalPackets) {
          const callback: HIDCallback | undefined = this.callbacks.get(
            message.callId,
          );
          switch (message.cmd) {
            case HID_EVENT:
              // handle the message
              this.emit("event", messages);
              break;

            case HID_CMD_UNKNOWN:
              this.logger.warn("unknown command", message.cmd, message.callId);
              break;

            default:
              if (callback) {
                callback(messages);
                this.callbacks.delete(message.callId);
              } else {
                this.logger.warn(
                  "unknown command",
                  message.cmd,
                  message.callId,
                );
              }
              break;
          }
          // remove from the pool when done
          this.messagePool.delete(poolKey);
        } else {
          this.messagePool.set(poolKey, messages);
        }
      } catch (error) {
        this.logger.error(error);
      }
    });
  }

  private _addCallback(callId: number, callback: HIDCallback) {
    this.callbacks.set(callId, callback);
  }

  /**
   * Writes a command to an HID devices
   */
  async _writeCommand(
    hidDevice: HID.HID,
    command: HIDCommand,
  ): Promise<HIDMessage[] | undefined> {
    let msgWritten = 0;
    let bytesWritten = 0;
    const mess = command.toHIDMessages();
    for (const message of mess) {
      await wait(100);

      try {
        // @ts-ignore | the function does exist
        bytesWritten += hidDevice.write(message.serialize());
      } catch (err) {
        log.error(err);
        return;
      }

      await wait(100);
      msgWritten += 1;
    }

    log.debug(msgWritten, "messages sent |", bytesWritten, "bytes written");
  }

  /**
   * Sends a command to the HID device. The returned promise resolves when the
   * the device responds with a matching callId.
   */
  private _sendCommand(command: HIDCommand): Promise<HIDMessage[]> {
    return new Promise((resolve) => {
      this._addCallback(command.callId, resolve);
      this._writeCommand(this.hidDevice, command);
    });
  }

  /**
   * Sends a command to retrieive layer metatdata
   */
  private async _getLayerMetadata(): Promise<LayerMetadata> {
    this.logger.info("Getting layer metadata");

    const messages = await this._sendCommand(
      new CmdGetLayersMetadata(nextCallId()),
    );
    const metadata = new CmdGetLayersMetadataResponse(messages);

    this.logger.debug(
      `layers: ${metadata.nLayers} | matrix dimensions: ${metadata.cols}x${metadata.rows}`,
    );

    return {
      numberOfLayers: metadata.nLayers,
      matrixCols: metadata.cols,
      matrixRows: metadata.rows,
    };
  }

  /**
   * Sends a command to retrieve layer data
   */
  private async _getLayerData(): Promise<CmdGetLayersResponse> {
    this.logger.debug("Getting device layer data");

    const messages = await this._sendCommand(new CmdGetLayers(nextCallId()));
    const layerData = new CmdGetLayersResponse(messages);

    return layerData;
  }

  /**
   * Retrieves layout information from the keyboard.
   * The returned promise resolves to an array of matrices, each representing
   * a single layer, where each cell is the keycode configured in QMK.
   * The format is: Layer x Row x Col x Keycode
   */
  async getLayers(): Promise<string[][][]> {
    const { numberOfLayers, matrixCols, matrixRows } =
      await this._getLayerMetadata();
    const layerData = await this._getLayerData();
    const layers = layerData.getLayers(numberOfLayers, matrixRows, matrixCols);

    return layers;
  }
}
