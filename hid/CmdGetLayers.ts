import type HIDMessage from "./HIDMessage.js";
import Command from "./Command.js";
import Response from "./Response.js";
import { HID_CMD_GET_LAYERS } from "./constants.js";

/**
 * HID Command to get layer data
 * @example
 * const getLayersCommand = new CmdGetLayers(callId)
 *  getLayersCommand.toHIDMessages().forEach(message => {
 * HIDdevice.write(message.serialize())
 * });
 */
export class CmdGetLayers extends Command {
  constructor(callId: number) {
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
   * @param  hidMessages messages from HID
   */
  constructor(hidMessages: HIDMessage[]) {
    super(hidMessages, HID_CMD_GET_LAYERS);
  }

  /**
   * Returns the layers as a array of matrices of keycodes,
   * where `nLayers` is the number matrices (i.e. the length of the returned array)
   * `rows` is the number rows in each matrix
   * and `cols` is the number columns in each matrix
   * @param  nLayers   Number of layers
   * @param  rows      Number of rows
   * @param  cols      Number of columns
   * @return  Layers of matrices
   * @throws {Error} if the underlying `Uint8Array` does not contain enough data
   */
  getLayers(nLayers: number, rows: number, cols: number): string[][][] {
    const layers: string[][][] = [];
    const b: number[] = Array.from(this._bytes);
    let currentLayer = 0;
    let currentRow = 0;

    while (b.length !== 0) {
      const lower = b.shift() || 0;
      const upper = b.shift() || 0;
      // look like we are receiving big endian from EEPROM
      const keycode = lower | (upper << 8);

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
