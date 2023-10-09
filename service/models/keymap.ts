import Model from "./model.js";
import Key from "./key.js";
import Layer from "./layer.js";

import type { Relation } from "./model.js";

export type KeymapOptions = Pick<
  Keymap,
  "id" | "keycode" | "type" | "keyId" | "layerId"
>;

export enum KeymapType {
  Plain = "plain",
  ModTap = "mtap",
  LayerTap = "ltap",
  LayerMod = "lmod",
}

export default class Keymap extends Model {
  static table = "keymaps";
  id?: number;
  keycode: string;
  type: KeymapType;
  keyId: number;
  layerId: number;
  key?: Key;
  layer?: Layer;

  constructor(data: KeymapOptions) {
    super();
    this.id = data.id;
    this.keycode = data.keycode;
    this.type = data.type;
    this.keyId = data.keyId;
    this.layerId = data.layerId;

    this.loadRelations(data);
  }

  get relations(): Relation[] {
    return [
      { name: "key", model: Key, type: "belongsTo" },
      { name: "layer", model: Layer, type: "belongsTo" },
    ];
  }
}
