// @ts-check
import { HID_CMD_UNKNOWN } from "./constants.js";
import { HIDMessage } from "./message.js";

/**
 * Base clase for commands to be sent to an HID Device
 */
export default class Command {
  /**
   * @param {number} callId
   */
  constructor(callId) {
    this.cmd = HID_CMD_UNKNOWN;
    this.callId = callId;
    this._bytes = new Uint8Array(0);
  }

  /**
   * @returns {HIDMessage[]}
   */
  toHIDMessages() {
    return HIDMessage.package(this.cmd, this.callId, this._bytes);
  }
}
