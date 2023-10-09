//@ts-check
import Model from "./model.js";
import Layer from "./layer.js";
import Keymap from "./keymap.js";
import Key from "./key.js";

import type { Relation } from "./model.js";

export type KeyboardOptions = Pick<
  Keyboard,
  "id" | "name" | "vendorId" | "productId"
>;

export default class Keyboard extends Model {
  static table = "keyboards";

  id?: number;
  name: string;
  vendorId: number;
  productId: number;
  layers?: Layer[];
  keys?: Key[];
  keymaps?: Keymap;

  constructor(data: KeyboardOptions) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.vendorId = data.vendorId;
    this.productId = data.productId;

    this.loadRelations(data);
  }

  get relations(): Relation[] {
    return [
      { name: "layers", model: Layer, type: "hasMany" },
      { name: "keymaps", model: Keymap, type: "hasMany" },
      { name: "keys", model: Key, type: "hasMany" },
    ];
  }
}
