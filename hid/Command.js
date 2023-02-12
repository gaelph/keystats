const { HID_CMD_UNKNOWN } = require("./constants");
const HIDMessage = require("./message");

class Command {
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

module.exports = Command;
