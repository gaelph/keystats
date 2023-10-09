import Model from "./model.js";
import Keymap from "./keymap.js";
import Keyboard from "./keyboard.js";

import type { Relation } from "./model.js";

export type KeyOptions = Pick<
  Key,
  "id" | "column" | "row" | "hand" | "finger" | "keyboardId"
>;

export default class Key extends Model {
  static table = "keys";
  id?: number;
  column: number;
  row: number;
  hand: number;
  finger: number;
  keyboardId: number;
  keyboard?: Keyboard;

  constructor(data: KeyOptions) {
    super();
    this.id = data.id;
    this.column = data.column;
    this.row = data.row;
    this.hand = data.hand;
    this.finger = data.finger;
    this.keyboardId = data.keyboardId;

    this.loadRelations(data);
  }

  get relations(): Relation[] {
    return [
      { name: "keymaps", model: Keymap, type: "hasMany" },
      { name: "keyboard", model: Keyboard, type: "belongsTo" },
    ];
  }
}
