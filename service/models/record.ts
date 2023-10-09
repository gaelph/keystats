import Model from "./model.js";
import Keymap from "./keymap.js";

import type { Relation } from "./model.js";

export interface RecordOptions {
  id?: number;
  modifiers: number;
  application?: string;
  counts?: number;
  keymapId: number;
}

export default class Record extends Model {
  static table = "records";
  id?: number;
  modifiers: number;
  application?: string;
  counts: number;
  date: string;
  keymapId: number;
  keymap?: Keymap;

  constructor(data: RecordOptions) {
    super();
    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    this.id = data.id;
    this.modifiers = data.modifiers;
    this.application = data.application;
    this.counts = data.counts || 1;
    this.date = today;
    this.keymapId = data.keymapId;

    this.loadRelations(data);
  }

  get relations(): Relation[] {
    return [{ name: "keymap", model: Keymap, type: "belongsTo" }];
  }
}
