import Model, { loadRelations } from "./model.js";
import Key from "./key.js";
import type { Relation } from "./model.js";

export type KeymapOptions = Pick<
  Keymap,
  "id" | "keycode" | "type" | "column" | "row" | "layer" | "keyboardId"
>;

export enum KeymapType {
  Plain = "plain",
  ModTap = "mtap",
  LayerTap = "ltap",
  LayerMod = "lmod",
}

export default class Keymap extends Model {
  static table: "keymaps" = "keymaps";
  id?: number;
  keycode: string;
  type: KeymapType;
  layer: number;
  column: number;
  row: number;
  keyboardId: number;
  key?: Key;

  constructor(data: KeymapOptions) {
    super();
    this.id = data.id;
    this.keycode = data.keycode;
    this.type = data.type;
    this.layer = data.layer;
    this.column = data.column;
    this.row = data.row;
    this.keyboardId = data.keyboardId;

    loadRelations(this, data);
  }

  static get relations(): Relation<Keymap>[] {
    return [{ name: "key", model: Key, type: "belongsTo" }];
  }
}
