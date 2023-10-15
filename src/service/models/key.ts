import Model, { loadRelations } from "./model.js";
import Keymap from "./keymap.js";
import Keyboard from "./keyboard.js";

import type { Relation } from "./model.js";

export type KeyOptions = Pick<
  Key,
  "column" | "row" | "hand" | "finger" | "keyboardId"
>;

export default class Key extends Model {
  static table = "keys";
  column: number;
  row: number;
  hand: number;
  finger: number;
  keyboardId: number;
  keyboard?: Keyboard;
  keymaps?: Keymap[];

  constructor(data: KeyOptions) {
    super();
    this.column = data.column;
    this.row = data.row;
    this.hand = data.hand;
    this.finger = data.finger;
    this.keyboardId = data.keyboardId;

    loadRelations(this, data);
  }

  static get relations(): Relation<Key>[] {
    return [
      { name: "keymaps", model: Keymap, type: "hasMany" },
      { name: "keyboard", model: Keyboard, type: "belongsTo" },
    ];
  }
}
