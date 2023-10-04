import Keymap from "./keymap.js";

export default class Record {
  id;
  keycode;
  modifiers;
  application;
  counts;
  date;
  keymapId;
  keymap;

  constructor(data = {}) {
    this.id = data.id;
    this.keycode =
      typeof data.keycode === "number"
        ? data.keycode
        : parseInt(data.keycode, 16);
    this.modifiers = data.modifiers;
    this.application = data.application;
    this.counts = data.counts;
    this.date = new Date(data.date);
    this.keymapId = data.keymapId;

    const dataKeys = Object.keys(data);
    if (dataKeys.some((k) => k.startsWith("keymap."))) {
      const keymapData = dataKeys.reduce((acc, k) => {
        if (k.startsWith("keymap.")) {
          acc[k.replace("keymap.", "")] = data[k];
        }
      }, {});

      this.keymap = new Keymap(keymapData);
    }
  }
}
