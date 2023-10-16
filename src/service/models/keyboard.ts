//@ts-check
import Model, { loadRelations } from "./model.js";
import Keymap from "./keymap.js";
import Key from "./key.js";

import type { Relation } from "./model.js";

export type KeyboardOptions = Pick<
  Keyboard,
  "id" | "name" | "vendorId" | "productId"
>;

export default class Keyboard extends Model {
  static table: "keyboards" = "keyboards";

  id?: number;
  name: string;
  vendorId: number;
  productId: number;
  keys?: Key[];
  keymaps?: Keymap;

  constructor(data: KeyboardOptions) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.vendorId = data.vendorId;
    this.productId = data.productId;

    loadRelations(this, data);
  }

  static get relations(): Relation<Keyboard>[] {
    return [
      { name: "keymaps", model: Keymap, type: "hasMany" },
      { name: "keys", model: Key, type: "hasMany" },
    ];
  }
}
