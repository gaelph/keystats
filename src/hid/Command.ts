import { HID_CMD_UNKNOWN } from "./constants.js";
import HIDMessage from "./HIDMessage.js";

/**
 * Base clase for commands to be sent to an HID Device
 */
export default class Command {
  cmd: number;
  callId: number;
  protected _bytes: Uint8Array;

  constructor(callId: number) {
    this.cmd = HID_CMD_UNKNOWN;
    this.callId = callId;
    this._bytes = new Uint8Array(0);
  }

  toHIDMessages(): HIDMessage[] {
    return HIDMessage.package(this.cmd, this.callId, this._bytes);
  }
}
