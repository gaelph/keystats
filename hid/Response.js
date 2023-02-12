// @ts-check
/** @typedef {import('./message')} HIDMessage */

/**
 * Base class for a Response from a call, or any
 * output coming from an HID Device
 */
class Response {
  /**
   * @param {HIDMessage[]} hidMessages
   * @param {number} cmd  Command identifier byte
   */
  constructor(hidMessages, cmd) {
    hidMessages.sort((a, b) => a.packetNumber - b.packetNumber);
    this._bytes = new Uint8Array(0);

    // Aggregate all the messages
    for (const hidMessage of hidMessages) {
      if (hidMessage.cmd !== cmd) {
        throw new Error("Message is not an HID Event");
      }
      const temp = new Uint8Array(
        this._bytes.length + hidMessage._bytes.length
      );
      temp.set(this._bytes);
      temp.set(hidMessage.bytes, this._bytes.length);

      this._bytes = temp;
    }
  }
}

module.exports = Response;
