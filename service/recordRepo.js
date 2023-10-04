import Record from "./models/record";
const KEYMAPS = "keymaps";
const RECORDS = "records";

export default class RecordRepo {
  #db;

  constructor(db) {
    this.#db = db;
  }

  async addRecord(keycode, { modifiers, row, column, layer, application }) {
    const date = new Date();
    const record = new Record({
      date,
      keycode,
      modifiers,
    });
    if (application) {
      record.application = application;
    }

    const keymap = await this.#db
      .select("keymaps.id")
      .from(KEYMAPS)
      .join("keys", function () {
        this.on("keys.id", "=", "keymaps.keyId");
      })
      .where({
        "keys.column": column,
        "keys.row": row,
        "keys.layerId": layer,
      })
      .first();

    if (!keymap) {
      throw new Error(
        `No keymap found at coordinates ${row}, ${column}, ${layer}`,
      );
    }

    record.keymapId = keymap.id;

    const exists = await this.#db
      .select("id", "counts")
      .from(RECORDS)
      .where({
        keycode: keycode,
        modifiers: modifiers,
        application: application,
        date: date,
        keymapId: keymap.id,
      })
      .first();

    if (!exists) {
      record.counts = 1;
      const [id] = await this.#db.insert(RECORDS, record);
      record.id = id;

      return record;
    }

    await this.#db(RECORDS).where("id", exists.id).increment("counts", 1);

    record.id = exists.id;
    record.counts = exists.counts + 1;

    return record;
  }

  async getRecordsBy({ date, period, after, before, application, layer }) {
    let where = (builder) => {
      if (period) {
        builder.whereBetween("date", [period[0], period[1]]);
      }
      if (after) {
        builder.where("date", ">=", after);
      }
      if (before) {
        builder.where("date", "<=", before);
      }
      if (date) {
        builder.where("date", "=", date);
      }
      if (application) {
        if (Array.isArray(application)) {
          builder.whereIn("application", application);
        } else {
          builder.where("application", "=", application);
        }
      }
      if (layer) {
        if (Array.isArray(layer)) {
          builder.whereIn("layer", layer);
        } else {
          builder.where("layer", "=", layer);
        }
      }
    };

    const records = await this.#db
      .column([
        { id: "records.id" },
        { keycode: "records.keycode" },
        { modifiers: "records.modifiers" },
        { counts: "records.counts" },
        { date: "records.date" },
        { application: "records.application" },
        { keymapId: "records.keymapId" },
        { "keymap.id": "keymaps.id" },
        { "keymap.keyId": "keymaps.keyId" },
        { "keymap.layerId": "keymaps.layerId" },
        { "keymap.keycode": "keymaps.keycode" },
        { "keymap.key.id": "keys.id" },
        { "keymap.key.column": "keys.column" },
        { "keymap.key.row": "keys.row" },
      ])
      .select()
      .from(RECORDS)
      .join("keymaps", function () {
        this.on("keymaps.id", "=", "records.keymapId");
      })
      .join("keys", function () {
        this.on("keys.id", "=", "keymaps.keyId");
      })
      .where(where);

    return records.map((record) => new Record(record));
  }
}
