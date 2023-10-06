import type HIDMessage from "./HIDMessage.js";

/**
 * Base class for a Response from a call, or any
 * output coming from an HID Device
 */
export default class Response {
  protected _bytes: Uint8Array;

  constructor(hidMessages: HIDMessage[], cmd: number) {
    hidMessages.sort((a, b) => a.packetNumber - b.packetNumber);
    this._bytes = new Uint8Array(0);

    // Aggregate all the messages
    for (const hidMessage of hidMessages) {
      if (hidMessage.cmd !== cmd) {
        throw new Error("Message is not an HID Event");
      }
      const temp = new Uint8Array(this._bytes.length + hidMessage.bytes.length);
      temp.set(this._bytes);
      temp.set(hidMessage.bytes, this._bytes.length);

      this._bytes = temp;
    }
  }
}
