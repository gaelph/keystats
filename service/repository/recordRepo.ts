import type { Knex } from "knex";
import Record, { RecordOptions } from "../models/record.js";
import Keymap, { KeymapType } from "../models/keymap.js";
import { DatabaseRecordNotFoundError } from "../database.js";

import Repository from "./Repository.js";
import Key from "../models/key.js";
import Layer from "../models/layer.js";

interface AddRecordOptions {
  type: KeymapType;
  modifiers: number;
  row?: number;
  column?: number;
  application?: string;
  counts?: number;
}

interface RecordQueryOptions {
  layer: number | number[];
  date: Date;
  period: Date[];
  after: Date;
  before: Date;
}

export default class RecordRepo implements Repository<Record> {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  build(options: RecordOptions): Record {
    return new Record(options);
  }

  async create(record: Record): Promise<Record> {
    const [result] = await this.#db(Record.table)
      .insert(record)
      .returning("id");

    if (!result) {
      throw new Error("Could not create record");
    }

    record.id = result.id;

    return record;
  }

  async getById(id: number): Promise<Record> {
    const record = await this.#db(Record.table).where({ id }).first();
    if (!record) {
      throw new DatabaseRecordNotFoundError(Record);
    }

    return new Record(record);
  }

  async getAll(): Promise<Record[]> {
    const rows = await this.#db(Record.table).select("*");
    return rows.map((row) => new Record(row));
  }

  async update(record: Record): Promise<Record> {
    if (!record.id) {
      throw new Error("Record must have an id to update");
    }

    const exists = await this.getById(record.id);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(Record);
    }

    const [result] = await this.#db(Record.table)
      .where({ id: record.id })
      .update({
        modifiers: record.modifiers,
        application: record.application || null,
        counts: record.counts || 1,
      })
      .returning(["modifiers", "application", "counts"]);

    record.modifiers = result.modifiers;
    record.application = result.application;
    record.counts = result.counts;

    return record;
  }

  async delete(id: number): Promise<void> {
    await this.#db(Record.table).where({ id }).del();
  }

  async addRecord(
    keyboardId: number,
    layerIndex: number,
    keycode: string,
    { type, modifiers, row, column, application, counts = 1 }: AddRecordOptions,
  ): Promise<Record | null> {
    // Find keymap by coordinates in layer
    let query = this.#db
      .select("keymaps.id")
      .from(Keymap.table)
      .join(Layer.table, function () {
        this.on("layers.id", "=", "keymaps.layerId");
      })
      .join(Key.table, function () {
        this.on("keys.id", "=", "keymaps.keyId");
      })
      .where({
        "keymaps.keycode": keycode,
        "keymaps.type": type,
        "layers.keyboardId": keyboardId,
        "keys.column": column,
        "keys.row": row,
      })
      .andWhere("layers.index", "<=", layerIndex)
      .orderBy("layers.index", "desc")
      .first();

    const keymap = await query;

    if (!keymap) {
      const sql = query.toSQL().toNative();
      console.log(sql.sql, sql.bindings);
      return null;
    }

    const record = new Record({
      modifiers,
      keymapId: keymap.id,
    });

    if (application) {
      record.application = application;
    }

    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    // If there is already a record for this keycode and modifiers
    // and application on that same day;
    // increment the count
    query = await this.#db
      .select("id", "counts")
      .from(Record.table)
      .where({
        modifiers: modifiers,
        date: today,
        keymapId: keymap.id,
      })
      .first();

    const exists = await query;

    // Create a new record if it is the first one today
    if (!exists) {
      record.counts = counts;
      const [rec] = await this.#db(Record.table).insert(
        [
          {
            application: record.application,
            counts: record.counts,
            date: record.date,
            keymapId: record.keymapId,
            modifiers: record.modifiers,
          },
        ],
        ["id"],
      );
      record.id = rec.id;
    } else {
      // Otherwise, increment the count
      const [result] = await this.#db(Record.table)
        .where("id", exists.id)
        .increment("counts", 1)
        .returning(["id", "counts"]);

      record.id = result.id;
      record.counts = result.counts + 1;
    }

    return record;
  }

  async getRecords(keyboardId: number): Promise<Record[]> {
    const rows = await this.#db(Record.table)
      .select({
        id: "records.id",
        counts: "records.counts",
        date: "records.date",
        keymapId: "keymaps.id",
        modifiers: "records.modifiers",
        "keymaps.keycode": "keymaps.keycode",
        "keymaps.type": "keymaps.type",
        "keymaps.layers.index": "layers.index",
        "keymaps.layers.keyboardId": "layers.keyboardId",
        "keymaps.keys.column": "keys.column",
        "keymaps.keys.row": "keys.row",
      })
      .join(Keymap.table, function () {
        this.on("keymaps.id", "=", "records.keymapId");
      })
      .join(Layer.table, function () {
        this.on("layers.id", "=", "keymaps.layerId");
      })
      .join("keys", "keys.id", "=", "keymaps.keyId")
      .where({ "layers.keyboardId": keyboardId });

    return rows.map((row) => new Record(row));
  }

  async getTotalCounts(
    keyboardId: number,
  ): Promise<
    { count: number | string; layer: number; row: number; column: number }[]
  > {
    const query = this.#db(Record.table)
      .select([
        "layers.index AS layer",
        "keys.row AS row",
        "keys.column AS column",
      ])
      .sum("records.counts AS count")
      .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
      .join(Layer.table, "layers.id", "=", "keymaps.layerId")
      .join(Key.table, "keys.id", "=", "keymaps.keyId")
      .where("layers.keyboardId", keyboardId)
      .groupBy("layers.index", "keys.column", "keys.row");

    try {
      return (await query) as {
        count: number;
        layer: number;
        row: number;
        column: number;
      }[];
    } catch (error: unknown) {
      console.error("failed to get total counts", error);
      console.error(query.toSQL().toNative());
    }
    return [];
  }

  async getRecordsBy({
    date,
    period,
    after,
    before,
    layer,
  }: RecordQueryOptions): Promise<Record[]> {
    if (
      (date && period) ||
      (date && after) ||
      (date && before) ||
      (period && after) ||
      (period && before)
    ) {
      throw new Error(
        "Only one of `date`, `period`, `after` or `before` can be specified",
      );
    }

    const where = (builder: Knex.QueryBuilder): Knex.QueryBuilder => {
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
      if (layer) {
        if (Array.isArray(layer)) {
          builder.whereIn("layer", layer);
        } else {
          builder.where("layer", "=", layer);
        }
      }

      return builder;
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
      .from(Record.table)
      .join("keymaps", function () {
        this.on("keymaps.id", "=", "records.keymapId");
      })
      .join("keys", function () {
        this.on("keys.id", "=", "keymaps.keyId");
      })
      .where(where);

    return records.map((record) => new Record(record));
  }

  async getPlainRecords(
    keyboardId: number,
  ): Promise<
    { id: number; keycode: string; modifiers: number; counts: number }[]
  > {
    const query = this.#db(Record.table)
      .select([
        { id: "records.id" },
        { keycode: "keymaps.keycode" },
        { modifiers: "records.modifiers" },
        { counts: "records.counts" },
      ])
      .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
      .join(Layer.table, "layers.id", "=", "keymaps.layerId")
      .where({
        "layers.keyboardId": keyboardId,
        "keymaps.type": KeymapType.Plain,
      });

    try {
      return await query;
    } catch (error: unknown) {
      console.error("failed to get total counts", error);
      console.error(query.toSQL().toNative());
      return [];
    }
  }
}
