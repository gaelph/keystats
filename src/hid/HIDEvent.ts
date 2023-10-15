import type HIDMessage from "./HIDMessage.js";
import { HID_EVENT } from "./constants.js";
import Response from "./Response.js";

const KEYCODE_LOWER = 0;
const KEYCODE_UPPER = 1;
const COL = 2;
const ROW = 3;
const PRESSED = 4;
const MODS = 5;
const LAYER = 6;

/**
 * Key events from an HID device
 * @property  keycode  The pressed/released keycode (16-bit)
 * @property  col      The column on the physical matrix
 * @property  row      The row on the physical matrix
 * @property  pressed Wether the key is pressed or released
 * @property  mods     The modifier keys pressed
 * @property  layer    The layer on which the event occurred
 */
export default class HIDEvent extends Response {
  keycode: number;
  col: number;
  row: number;
  pressed: boolean;
  mods: number;
  layer: number;

  constructor(hidMessages: HIDMessage[]) {
    super(hidMessages, HID_EVENT);

    this.keycode =
      (this._bytes[KEYCODE_UPPER] << 8) | this._bytes[KEYCODE_LOWER];
    this.col = this._bytes[COL];
    this.row = this._bytes[ROW];
    this.pressed = this._bytes[PRESSED] == 1;
    this.mods = this._bytes[MODS];
    this.layer = this._bytes[LAYER];
  }
}
