const HEADER_SIZE = 6;
const REPORT_ID = 0;
const CMD = 1;
const CALLID_UPPER = 2;
const CALLID_LOWER = 3;
const PACKET_NUMBER = 4;
const TOTAL_PACKETS = 5;
const MESSAGE_LENGTH = 32;

class HIDMessage {
  static headerSize = HEADER_SIZE;
  static payloadSize = MESSAGE_LENGTH - HEADER_SIZE;

  constructor(bytes) {
    if (bytes && bytes instanceof Uint8Array) {
      this._bytes = bytes.slice(HEADER_SIZE, MESSAGE_LENGTH);

      this.reportId = bytes[REPORT_ID]; // should be 0
      this.cmd = bytes[CMD];
      this.callId = (bytes[CALLID_UPPER] << 8) | bytes[CALLID_LOWER];
      this.packetNumber = bytes[PACKET_NUMBER];
      this.totalPackets = bytes[TOTAL_PACKETS];

      if (this.totalPackets < 1) {
        throw new Error("Invalid total packets");
      }
      if (this.packetNumber >= this.totalPackets) {
        throw new Error("Invalid packet number");
      }
    } else {
      this._bytes = new Uint8Array(HIDMessage.payloadSize);
      this._bytes.fill(0);
      this.packetNumber = 0;
      this.totalPackets = 1;
    }
  }

  get bytes() {
    return this._bytes;
  }

  set bytes(b) {
    this._bytes.fill(0);
    this._bytes.set(b);
    return;
  }

  get length() {
    return this._bytes.length;
  }

  set length(n) {
    return;
  }

  serialize() {
    const array = new Uint8Array(this._bytes.length + HEADER_SIZE);

    if (array.length != MESSAGE_LENGTH) {
      throw new Error(`invalid message length (${array.length}`);
    }

    array[REPORT_ID] = 0;
    array[CMD] = this.cmd;
    array[CALLID_UPPER] = (this.callId >> 8) & 0xff;
    array[CALLID_LOWER] = this.callId & 0xff;
    array[PACKET_NUMBER] = this.packetNumber & 0xff;
    array[TOTAL_PACKETS] = this.packetNumber & 0xff;

    for (let i in this._bytes) {
      array[i + HEADER_SIZE] = this._bytes[i];
    }

    return array;
  }

  static package(cmd, callId, bytes) {
    let totalPackets = Math.ceil(bytes.length / HIDMessage.payloadSize);
    if (totalPackets == 0) totalPackets++;

    const messages = [];

    for (let packetNumber = 0; packetNumber < totalPackets; packetNumber++) {
      const message = new HIDMessage();
      message.cmd = cmd;
      message.callId = callId;
      message.packetNumber = packetNumber;
      message.totalPackets = totalPackets;
      message.bytes = bytes.slice(
        packetNumber * HIDMessage.payloadSize,
        (packetNumber + 1) * HIDMessage.payloadSize
      );

      messages.push(message);
    }

    return messages;
  }
}

module.exports = HIDMessage;
