// @ts-check
import Command from "./Command.js";
import Response from "./Response.js";
import { HID_CMD_GET_LAYERS } from "./constants.js";

/** @typedef {import('./message').HIDMessage} HIDMessage */

/*
typedef struct {
  uint8_t n_layers;
  uint8_t rows;
  uint8_t cols;
} hid_layer_metadata_t;
*/

/**
 * HID Command to get layer data
 * @example
 * const getLayersCommand = new CmdGetLayers(callId)
 *  getLayersCommand.toHIDMessages().forEach(message => {
 * HIDdevice.write(message.serialize())
 * });
 */
export class CmdGetLayers extends Command {
  constructor(callId) {
    super(callId);
    this.cmd = HID_CMD_GET_LAYERS;
  }
}

/**
 * Response from a CmdGetLayers command
 * @example
 * const response = new CmdGetLayersResponse(hidMessages);
 * const layers = response.getLayers(6, 4, 12);
 */
export class CmdGetLayersResponse extends Response {
  /**
   * @param {HIDMessage[]} hidMessages messages from HID
   */
  constructor(hidMessages) {
    super(hidMessages, HID_CMD_GET_LAYERS);
  }

  /**
   * Returns the layers as a array of matrices of keycodes,
   * where `nLayers` is the number matrices (i.e. the length of the returned array)
   * `rows` is the number rows in each matrix
   * and `cols` is the number columns in each matrix
   * @param {number} nLayers   Number of layers
   * @param {number} rows      Number of rows
   * @param {number} cols      Number of columns
   * @return {string[][][]} Layers of matrices
   * @throws {Error} if the underlying `Uint8Array` does not contain enough data
   */
  getLayers(nLayers, rows, cols) {
    /** @type {string[][][]} */
    const layers = [];
    const b = Array.from(this._bytes);
    let currentLayer = 0;
    let currentRow = 0;

    while (b.length !== 0) {
      // look like we are receiving big endian from EEPROM
      const keycode = b.shift() | (b.shift() << 8);

      if (!layers[currentLayer]) {
        layers[currentLayer] = [];
        currentRow = 0;
      }

      if (!layers[currentLayer][currentRow]) {
        layers[currentLayer][currentRow] = [];
      }

      layers[currentLayer][currentRow].push(keycode.toString(16));

      if (layers[currentLayer][currentRow].length === cols) {
        if (layers[currentLayer].length === rows) {
          currentLayer++;
          currentRow = 0;
        } else {
          layers[currentLayer].push([]);
          currentRow++;
        }
      }
    }

    return layers;
  }
}
