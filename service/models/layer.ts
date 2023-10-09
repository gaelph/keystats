import Model from "./model.js";
import Keyboard from "./keyboard.js";
import Keymap from "./keymap.js";

import type { Relation } from "./model.js";

export type LayerOptions = Pick<Layer, "id" | "index" | "keyboardId">;

export default class Layer extends Model {
  static table = "layers";

  id?: number;
  index: number;
  keyboardId: number;
  keyboard?: Keyboard;
  keymaps?: Keymap[];

  constructor(data: LayerOptions) {
    super();
    this.id = data.id;
    this.index = data.index;
    this.keyboardId = data.keyboardId;

    this.loadRelations(data);
  }

  get relations(): Relation[] {
    return [
      {
        name: "keyboard",
        type: "belongsTo",
        model: Keyboard,
      },
      {
        name: "keymaps",
        type: "hasMany",
        model: Keymap,
      },
    ];
  }
}
