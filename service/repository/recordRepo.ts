import type { Knex } from "knex";
import Record, { RecordOptions } from "../models/record.js";
import Keymap, { KeymapType } from "../models/keymap.js";
import db, { DatabaseError, NotFoundError } from "../database.js";

import Repository from "./Repository.js";
import Key from "../models/key.js";
import Layer from "../models/layer.js";

import KeymapRepo from "./keymapRepo.js";

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

type RecordCount = Pick<Record, "id" | "counts" | "modifiers"> &
  Pick<Keymap, "keycode">;

export default class RecordRepo implements Repository<Record> {
  #db: Knex;
  #keymapRepo: KeymapRepo;

  constructor() {
    this.#db = db;
    this.#keymapRepo = new KeymapRepo();
  }

  build(options: RecordOptions): Record {
    return new Record(options);
  }

  async create(record: Record): Promise<Record> {
    const query = this.#db(Record.table).insert(record).returning("*");
    let result: any;

    try {
      result = await query;
      if (!result) {
        throw new Error("Insert did not return a value");
      }
    } catch (error: unknown) {
      throw new DatabaseError("Failed to create record", query, error as Error);
    }

    return new Record(result);
  }

  async getById(id: number): Promise<Record> {
    let row: any;
    const query = this.#db(Record.table).where({ id }).first();

    try {
      row = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Faild to get record", query, error as Error);
    }

    if (row) return new Record(row);

    throw new NotFoundError(query);
  }

  async getAll(): Promise<Record[]> {
    throw new Error("Method not implemented.");
  }

  async update(record: Record): Promise<Record> {
    await this.getById(record.id!);

    const query = this.#db(Record.table)
      .where({ id: record.id })
      .update({
        modifiers: record.modifiers,
        application: record.application || null,
        counts: record.counts || 1,
      })
      .returning("*");

    try {
      const [row] = await query;
      return new Record(row);
    } catch (error: unknown) {
      throw new DatabaseError("Failed to update record", query, error as Error);
    }
  }

  async delete(id: number): Promise<void> {
    const query = this.#db(Record.table).where({ id }).del();

    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to delete record", query, error as Error);
    }
  }

  async addRecord(
    keyboardId: number,
    layerIndex: number,
    keycode: string,
    { type, modifiers, row, column, counts = 1 }: AddRecordOptions,
  ): Promise<Record | null> {
    // Find keymap by coordinates in layer
    const keymap = await this.#keymapRepo.getKeymapAtCoordinates(
      keyboardId,
      layerIndex,
      column!,
      row!,
      keycode,
      type,
    );

    let record = new Record({
      modifiers,
      keymapId: keymap.id!,
    });

    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    // If there is already a record for this keycode and modifiers
    // and application on that same day;
    // increment the count
    let existing: { id: number; counts: number } | undefined;
    let query = await this.#db
      .select("id", "counts")
      .from(Record.table)
      .where({
        modifiers: modifiers,
        date: today,
        keymapId: keymap.id,
      })
      .first();

    try {
      existing = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get record", query, error as Error);
    }

    // Create a new record if it is the first one today
    if (!existing) {
      record.counts = counts;
      let result;
      query = this.#db<Record>(Record.table).insert(
        {
          application: record.application,
          counts: record.counts,
          date: record.date,
          keymapId: record.keymapId,
          modifiers: record.modifiers,
        },
        ["*"],
      );

      try {
        [result] = await query;
        record = new Record(result);
      } catch (error: unknown) {
        throw new DatabaseError(
          "Failed to create record",
          query,
          error as Error,
        );
      }
    } else {
      // Otherwise, increment the count
      let result;
      const query = this.#db(Record.table)
        .where("id", existing.id)
        .increment("counts", 1)
        .returning("*");

      try {
        [result] = await query;
        record = new Record(result);
      } catch (error: unknown) {
        throw new DatabaseError(
          "Failed to increment record count",
          query,
          error as Error,
        );
      }
    }

    return record;
  }

  async getRecords(keyboardId: number): Promise<Record[]> {
    const query = this.#db(Record.table)
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

    try {
      const rows = await query;
      return rows.map((row) => new Record(row));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get records", query, error as Error);
    }
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
      throw new DatabaseError(
        "Failed to get total counts",
        query,
        error as Error,
      );
    }
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

    const query = this.#db
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

    try {
      const records = await query;
      return records.map((record) => new Record(record));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get records", query, error as Error);
    }
  }

  async getPlainRecords(keyboardId: number): Promise<RecordCount[]> {
    const query = this.#db(Record.table)
      .select({
        id: "records.id",
        keycode: "keymaps.keycode",
        modifiers: "records.modifiers",
        counts: "records.counts",
      })
      .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
      .join(Layer.table, "layers.id", "=", "keymaps.layerId")
      .where({
        "layers.keyboardId": keyboardId,
        "keymaps.type": KeymapType.Plain,
      });

    try {
      const result = await query;

      return result;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get plain records",
        query,
        error as Error,
      );
    }
  }
}
