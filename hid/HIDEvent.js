// @ts-check
const { HID_EVENT } = require("./constants");
const Response = require("./Response");

/** @typedef {import('./message')} HIDMessage */

const KEYCODE_UPPER = 0;
const KEYCODE_LOWER = 1;
const COL = 2;
const ROW = 3;
const PRESSED = 4;
const MODS = 5;
const LAYER = 6;
/*
  typedef struct {
  uint16_t keycode;
  uint8_t col;
  uint8_t row;
  uint8_t pressed;
  uint8_t mods = get_mods();
  uint8_t layer;
} hid_event_t;
*/

/**
 * Key events from an HID device
 * @property {number} keycode  The pressed/released keycode (16-bit)
 * @property {number} col      The column on the physical matrix
 * @property {number} row      The row on the physical matrix
 * @property {boolean} pressed Wether the key is pressed or released
 * @property {number} mods     The modifier keys pressed
 * @property {number} layer    The layer on which the event occurred
 */
class HIDEvent extends Response {
  /**
   * @param {HIDMessage[]} hidMessages
   */
  constructor(hidMessages) {
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

module.exports = HIDEvent;
