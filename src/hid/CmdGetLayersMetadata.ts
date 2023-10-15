import type HIDMessage from "./HIDMessage.js";
import Command from "./Command.js";
import Response from "./Response.js";
import { HID_CMD_GET_LAYERS_METADATA } from "./constants.js";

const N_LAYERS = 0;
const ROWS = 1;
const COLS = 2;

/**
 * HID Command to get layer metadata,
 * that is number of layers, and matrix dimensions
 * @example
 * const getLayersMetadataCommand = new CmdGetLayersMetadata(13);
 * getLayersMetadataCommand.toHIDMessages().forEach(message => {
 *   HIDDevice.write(message.serialize());
 * });
 */
export class CmdGetLayersMetadata extends Command {
  constructor(callId: number) {
    super(callId);
    this.cmd = HID_CMD_GET_LAYERS_METADATA;
  }
}

/**
 * Response to a CmdGetLayersMetadata command
 * @example
 * const layersMetadata = new CmdGetLayersMetadataResponse(hidMessages);
 * console.log(layersMetadata.nLayers);
 * console.log(layersMetadata.rows);
 * console.log(layersMetadata.cols);
 */
export class CmdGetLayersMetadataResponse extends Response {
  nLayers: number;
  rows: number;
  cols: number;

  constructor(hidMessages: HIDMessage[]) {
    super(hidMessages, HID_CMD_GET_LAYERS_METADATA);

    this.nLayers = this._bytes[N_LAYERS];
    this.rows = this._bytes[ROWS];
    this.cols = this._bytes[COLS];
  }
}
