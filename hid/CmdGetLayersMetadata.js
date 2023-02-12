// @ts-check
const Command = require("./Command");
const Response = require("./Response");
const { HID_CMD_GET_LAYERS_METADATA } = require("./constants");

/** @typedef {import('./message')} HIDMessage */

const N_LAYERS = 0;
const ROWS = 1;
const COLS = 2;
/*
typedef struct {
  uint8_t n_layers;
  uint8_t rows;
  uint8_t cols;
} hid_layer_metadata_t;
*/

/**
 * HID Command to get layer metadata,
 * that is number of layers, and matrix dimensions
 * @property {number} callId
 * @example
 * const getLayersMetadataCommand = new CmdGetLayersMetadata(13);
 * getLayersMetadataCommand.toHIDMessages().forEach(message => {
 *   HIDDevice.write(message.serialize());
 * });
 */
class CmdGetLayersMetadata extends Command {
  /**
   * @param {number} callId
   */
  constructor(callId) {
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
class CmdGetLayersMetadataResponse extends Response {
  /**
   * @param {HIDMessage[]} hidMessages
   */
  constructor(hidMessages) {
    super(hidMessages, HID_CMD_GET_LAYERS_METADATA);

    this.nLayers = this._bytes[N_LAYERS];
    this.rows = this._bytes[ROWS];
    this.cols = this._bytes[COLS];
  }
}

module.exports = {
  CmdGetLayersMetadata,
  CmdGetLayersMetadataResponse,
};
