import { EventEmitter } from "events";
import HID from "node-hid";
import usbDetect from "usb-detection";
import log from "loglevel";
import loglevelPrefix from "loglevel-prefix";

import { HIDMessage } from "../hid/message.js";
import { HID_EVENT, HID_CMD_UNKNOWN } from "../hid/constants";
import {
  CmdGetLayers,
  CmdGetLayersMetadata,
  CmdGetLayersMetadataResponse,
  CmdGetLayersResponse,
} from "../hid/CmdGetLayersMetadata";

const MAX_CALL_ID = 0xffff;
let currentCallId = 0;

/**
 * An async function that waits for n milliseconds
 * @param {number} n Milliseconds to wait for
 * @returns {Promise<void>}
 */
function wait(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), n);
  });
}

/**
 * Returns the next available `callId`. Since call ids are 16-bit integers,
 * when reaching the highest value, we go back to 0.
 * This allows for 65536 simultaneous calls. Overkill
 * @returns {number}
 */
function nextCallId() {
  if (currentCallId == MAX_CALL_ID) {
    currentCallId = 0;
  } else {
    currentCallId++;
  }

  return currentCallId;
}

class HIDKeyboard extends EventEmitter {
  hidDevice;
  manager;

  constructor(hidDevice, manager) {
    super();

    this.hidDevice = hidDevice;
    this.manager = manager;

    this.logger = log.getLogger("HIDKeyboard");
    loglevelPrefix(this.logger);

    this.manager.onMessage((message) => {
      this.emit("message", message);
    });
  }

  _sendCommand(command) {
    return new Promise((resolve) => {
      this.manager.addCallback(command.callId, resolve);
      this.manager.writeCommand(this.hidDevice, command);
    });
  }

  async _getLayerMetadata() {
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

  async _getLayerData() {
    this.logger.debug("Getting device layer data");

    const messages = await this._sendCommand(new CmdGetLayers(nextCallId()));
    const layerData = new CmdGetLayersResponse(messages);

    return layerData;
  }

  async getLayers() {
    const { numberOfLayers, matrixCols, matrixRows } =
      await this._getLayerMetadata();
    const layerData = await this._getLayerData();
    const layers = layerData.getLayers(numberOfLayers, matrixRows, matrixCols);

    return layers;
  }
}

export default class HIDManager {
  vendorId;
  productId;
  usagePage;
  usage;
  messagePool = new Map();
  callbacks = new Map();
  listeners = [];
  devices = [];
  logger = log.getLogger("HIDManager");
  onListen = () => {};

  constructor({ vendorId, productId, usagePage, usage }) {
    this.vendorId = vendorId;
    this.productId = productId;
    this.usagePage = usagePage;
    this.usage = usage;

    loglevelPrefix(this.logger);
  }

  onMessage(listener) {
    this.listeners.push(listener);
  }

  addCallback(callId, callback) {
    this.callbacks.set(callId, callback);
  }

  async writeCommand(hidDevice, command) {
    let msgWritten = 0;
    let bytesWritten = 0;
    const mess = command.toHIDMessages();
    for (let message of mess) {
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

  _listen(device) {
    this.logger.info("Attaching device", device.path);
    try {
      let hidDevice = new HID.HID(device.path);
      hidDevice.on("error", (error) => {
        this.logger.error(error);
      });

      hidDevice.on(
        "data",
        /** @param {Uint8Array} data */
        (data) => {
          try {
            const message = new HIDMessage(data);

            // store the message in the message pool
            const poolKey = `${message.cmd}_${message.callId}`;
            if (!this.messagePool.has(poolKey)) {
              this.messagePool.set(poolKey, []);
            }
            this.messagePool.get(poolKey).push(message);

            // when all messages for the same call response have been received
            if (this.messagePool.get(poolKey).length == message.totalPackets) {
              switch (message.cmd) {
                case HID_EVENT:
                  // handle the message
                  this.listeners.map(async (listener) => {
                    listener(message, hidDevice);
                  });
                  break;

                case HID_CMD_UNKNOWN:
                  this.logger.warn(
                    "unknown command",
                    message.cmd,
                    message.callId,
                  );
                  break;

                default:
                  if (this.callbacks.has(message.callId)) {
                    this.callbacks.get(message.callId)(message);
                    this.callbacks.delete(message.callId);
                  }
                  break;
              }
              // remove from the pool when done
              this.messagePool.delete(poolKey);
            }
          } catch (error) {
            this.logger.error(error);
          }
        },
      );

      // Ensure the device is being listened to
      hidDevice.resume();

      // Register the device so that we can stop listening to it
      this.devices.push({
        usbDevice: device,
        hid: hidDevice,
      });

      this.logger.info("Device attached");

      this.onListen(new HIDKeyboard(hidDevice, this));
    } catch (error) {
      // silence
    }
  }

  async _attach() {
    let hidDevices = [];

    while (hidDevices.length === 0) {
      hidDevices = HID.devices(this.vendorId, this.productId).filter(
        (device) =>
          device.usagePage === this.usagePage && device.usage === this.usage,
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (hidDevices) {
      hidDevices.forEach((hidDevice) => this._listen(hidDevice));
    }

    return hidDevices.length != 0;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.onListen = resolve;
      usbDetect.startMonitoring();

      this.logger.info("Waiting for Keyboard");
      this._attach();

      usbDetect.on(`add:${this.vendorId}:${this.productId}`, () => {
        this.logger.info("Keyboard connected");

        try {
          this._attach();
        } catch (error) {
          log.error(error);
          reject(error);
        }
      });

      usbDetect.on(
        `remove:${this.vendorId}:${this.productId}`,
        (disconnectedDevice) => {
          this.logger.info("Plaid disconnected");
          this.devices.forEach(({ usbDevice, hid }) => {
            if (
              usbDevice.vendorId === disconnectedDevice.vendorId &&
              usbDevice.productId === disconnectedDevice.productId
            ) {
              hid.close();
            }
          });

          this.devices = [];
        },
      );
    });
  }
}
