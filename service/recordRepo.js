// @ts-check
import Record from "./models/record";

const KEYMAPS = "keymaps";
const RECORDS = "records";

export default class RecordRepo {
  /** @type {import("knex").Knex} */
  #db;

  /**
   * @param {import("knex").Knex} db
   */
  constructor(db) {
    this.#db = db;
  }

  /**
   * @param {number} keycode
   * @param {Object} opts
   * @param {number} opts.modifiers
   * @param {number} opts.row
   * @param {number} opts.column
   * @param {number} opts.layer
   * @param {string} [opts.application]
   * @returns {Promise<Record>}
   */
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

    // Find keymap by coordinates in layer
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

    // If there is already a record for this keycode and modifiers
    // and application on that same day;
    // increment the count
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

    // Create a new record if it is the first one today
    if (!exists) {
      record.counts = 1;
      const [id] = await this.#db.insert(
        RECORDS,
        /** @type {Object} */ (record),
      );
      record.id = id;

      return record;
    }

    // Otherwise, increment the count
    await this.#db(RECORDS).where("id", exists.id).increment("counts", 1);

    record.id = exists.id;
    record.counts = exists.counts + 1;

    return record;
  }

  /**
   * @param {Object} opts
   * @param {string} [opts.application]
   * @param {number|number[]} [opts.layer]
   * @param {Date} [opts.date]
   * @param {Date[]} [opts.period]
   * @param {Date} [opts.after]
   * @param {Date} [opts.before]
   * @returns {Promise<Record[]>}
   */
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
