import Model, { loadRelations } from "./model.js";
import Keymap from "./keymap.js";

import type { Relation } from "./model.js";
import { todayAsDbDate } from "../../utils/time.js";

export type RecordOptions = Pick<
  Record,
  "id" | "keymapId" | "modifiers" | "counts" | "date"
>;

export default class Record extends Model {
  static table: "records" = "records";
  id?: number;
  modifiers: number;
  application?: string;
  counts?: number;
  date?: string;
  keymapId: number;
  keymap?: Keymap;

  constructor(data: RecordOptions) {
    super();

    this.id = data.id;
    this.modifiers = data.modifiers || 0;
    this.counts = data.counts || 1;
    this.date = todayAsDbDate();
    this.keymapId = data.keymapId;

    loadRelations(this, data);
  }

  static get relations(): Relation<Record>[] {
    return [{ name: "keymap", model: Keymap, type: "belongsTo" }];
  }
}
