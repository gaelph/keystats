import type { Knex } from "knex";
import Record, { RecordOptions } from "../models/record.js";
import Keymap, { KeymapType } from "../models/keymap.js";
import db, { DatabaseError, NotFoundError } from "../database.js";

import Repository from "./Repository.js";

import KeymapRepo from "./keymapRepo.js";
import { Coordinates, FilterOptions } from "../types.js";
import Key from "../models/key.js";

interface AddRecordOptions {
  type: KeymapType;
  modifiers: number;
  row?: number;
  column?: number;
  application?: string;
  counts?: number;
}

export interface Count extends Coordinates {
  count: number;
}

export interface HandCount {
  hand: 0 | 1;
  count: number;
}

export interface FingerCount {
  finger: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  count: number;
}

export type RecordCount = Pick<Record, "id" | "counts" | "modifiers"> &
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
    const query = this.#db(Record.table)
      .insert({
        keymapId: record.keymapId,
        modifiers: record.modifiers,
        counts: record.counts,
        date: record.date,
      })
      .returning("*");
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

  async getOne(
    options: Pick<Record, "modifiers" | "date" | "keymapId">,
  ): Promise<Record> {
    const { modifiers, date, keymapId } = options;

    let row: any;
    const query = this.#db(Record.table)
      .where({
        modifiers: modifiers,
        date: date,
        keymapId: keymapId,
      })
      .first();

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
    keymap: Keymap,
    { modifiers, counts = 1 }: AddRecordOptions,
  ): Promise<Record | null> {
    const record = new Record({
      modifiers,
      keymapId: keymap.id!,
    });

    // TODO: This should be moved to a time utils library
    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    // If there is already a record for this keycode and modifiers
    // and application on that same day;
    // increment the count
    let existing: Record | null;
    try {
      existing = await this.getOne({
        modifiers,
        date: today,
        keymapId: keymap.id!,
      });
    } catch (error: unknown) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }

      existing = null;
    }

    // Create a new record if it is the first one today
    if (!existing) {
      record.counts = counts;
      return this.create(
        this.build({
          counts: record.counts,
          date: record.date,
          keymapId: record.keymapId,
          modifiers: record.modifiers,
        }),
      );
    } else {
      // Otherwise, incremnt the count
      existing.counts! += 1;
      return this.update(existing);
    }
  }

  async getRecords(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<Record[]> {
    const query = this.filterQuery(
      this.#db(Record.table)
        .select({
          id: "records.id",
          counts: "records.counts",
          date: "records.date",
          keymapId: "keymaps.id",
          modifiers: "records.modifiers",
          "keymaps.id": "keymaps.id",
          "keymaps.keycode": "keymaps.keycode",
          "keymaps.type": "keymaps.type",
          "keymaps.layer": "keymaps.layer",
          "keymaps.keyboardId": "keymaps.keyboardId",
          "keymaps.column": "keymaps.column",
          "keymaps.row": "keymaps.row",
        })
        .join(Keymap.table, function () {
          this.on("keymaps.id", "=", "records.keymapId");
        })
        .where({ "keymaps.keyboardId": keyboardId }),
      filter,
    );

    try {
      const results = await query;
      return results.map((result: any) => new Record(result));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get records", query, error as Error);
    }
  }

  async getKeymapUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<Count[]> {
    const query = this.filterQuery(
      this.#db(Record.table)
        .select([
          "keymaps.layer AS layer",
          "keymaps.row AS row",
          "keymaps.column AS column",
        ])
        .sum("records.counts AS count")
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .where("keymaps.keyboardId", keyboardId)
        .groupBy("keymaps.layer", "keymaps.row", "keymaps.column")
        .orderBy("keymaps.layer", "keymaps.row", "keymaps.column"),
      filter,
    );

    query.on("query", console.log);

    try {
      return (await query) as Count[];
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get total counts",
        query,
        error as Error,
      );
    }
  }

  async getLayerUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<Pick<Count, "layer" | "count">[]> {
    let result: { layer: number; count: number }[];
    let query;

    try {
      query = this.filterQuery(
        this.#db(Record.table)
          .select(["keymaps.layer AS layer"])
          .sum("records.counts AS count")
          .where("keymaps.keyboardId", keyboardId)
          .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
          .groupBy("layer")
          .orderBy("layer"),
        filter,
      );

      result = (await query) as { layer: number; count: number }[];
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get layer usage",
        query!,
        error as Error,
      );
    }

    return result || [];
  }

  async getRowUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<Pick<Count, "row" | "count">[]> {
    let result: { row: number; count: number }[];
    let query;

    try {
      query = this.filterQuery(
        this.#db(Record.table)
          .select(["keymaps.row AS row"])
          .sum("records.counts AS count")
          .where("keymaps.keyboardId", keyboardId)
          .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
          .groupBy("keymaps.row")
          .orderBy("keymaps.row"),
        filter,
      );

      result = (await query) as { row: number; count: number }[];
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get layer usage",
        query!,
        error as Error,
      );
    }

    return result || [];
  }

  async getHandUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<HandCount[]> {
    let result: HandCount[];
    let query;

    try {
      query = this.filterQuery(
        this.#db(Record.table)
          .select(["keys.hand AS hand"])
          .sum("records.counts AS count")
          .join(Key.table, function (join) {
            join
              .on("keymaps.keyboardId", "keys.keyboardId")
              .andOn("keymaps.row", "keys.row")
              .andOn("keymaps.column", "keys.column");
          })
          .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
          .where("keymaps.keyboardId", keyboardId)
          .groupBy("keys.hand")
          .orderBy("keys.hand"),
        filter,
      );

      result = (await query) as HandCount[];
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get layer usage",
        query!,
        error as Error,
      );
    }

    return result || [];
  }

  async getFingerUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<FingerCount[]> {
    let result: FingerCount[];
    let query;

    try {
      query = this.filterQuery(
        this.#db(Record.table)
          .select(["keys.finger AS finger"])
          .sum("records.counts AS count")
          .join(Key.table, function (join) {
            join
              .on("keymaps.keyboardId", "keys.keyboardId")
              .andOn("keymaps.row", "keys.row")
              .andOn("keymaps.column", "keys.column");
          })
          .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
          .where("keymaps.keyboardId", keyboardId)
          .groupBy("keys.finger")
          .orderBy("keys.finger"),
        filter,
      );

      result = (await query) as FingerCount[];
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get layer usage",
        query!,
        error as Error,
      );
    }

    return result || [];
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  private filterQuery(
    query: Knex.QueryBuilder,
    options: FilterOptions = {},
  ): Knex.QueryBuilder {
    const { date, period, after, before, type } = options;
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

    if (period) {
      query.whereBetween("records.date", [
        this.formatDate(period[0]),
        this.formatDate(period[1]),
      ]);
    }
    if (after) {
      query.where("records.date", ">=", this.formatDate(after));
    }
    if (before) {
      query.where("records.date", "<=", this.formatDate(before));
    }
    if (date) {
      query.where("records.date", "=", this.formatDate(date));
    }
    if (type) {
      query.where("keymaps.type", "=", type);
    }

    return query;
  }

  // TODO: might be useless, evaluate removal
  async getRecordsBy(filter: FilterOptions): Promise<Record[]> {
    const query = this.filterQuery(
      this.#db
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
          { "keymap.layer": "keymaps.layer" },
          { "keymap.keycode": "keymaps.keycode" },
          { "keymap.column": "keymaps.column" },
          { "keymap.row": "keymaps.row" },
        ])
        .select()
        .from(Record.table)
        .join("keymaps", function () {
          this.on("keymaps.id", "=", "records.keymapId");
        }),
      filter,
    );

    try {
      const records = await query;
      return records.map((record: any) => new Record(record));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get records", query, error as Error);
    }
  }

  async getCharacterCount(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<RecordCount[]> {
    filter.type = KeymapType.Plain;
    const query = this.filterQuery(
      this.#db(Record.table)
        .select({
          keycode: "keymaps.keycode",
          modifiers: "records.modifiers",
        })
        .sum("records.counts AS counts")
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .where({
          "keymaps.keyboardId": keyboardId,
        })
        .groupBy(["keycode", "modifiers"])
        .orderBy("counts", "desc"),
      filter,
    );

    try {
      const result = await query;

      return result as RecordCount[];
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get plain records",
        query,
        error as Error,
      );
    }
  }

  async getTotalKeypresses(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<number> {
    let result: { counts: number };
    const query = this.filterQuery(
      this.#db(Record.table)
        .sum("records.counts AS counts")
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .where("keymaps.keyboardId", keyboardId)
        .first(),
      filter,
    );

    try {
      result = (await query) as { counts: number };

      return result.counts;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get total keypresses",
        query,
        error as Error,
      );
    }

    return 0;
  }

  async getAvailableDates(keyboardId: number): Promise<string[]> {
    const query = this.#db(Record.table)
      .select("date")
      .where("keymaps.keyboardId", keyboardId)
      .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
      .groupBy("date")
      .orderBy("date", "asc")
      .pluck("date");
    let results: string[];

    try {
      results = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get available dates",
        query,
        error as Error,
      );
    }

    return results as string[];
  }
}
