import type { Knex } from "knex";
import Record, { RecordOptions } from "../models/record.js";
import Keymap, { KeymapType } from "../models/keymap.js";
import db, { DatabaseError, NotFoundError } from "../database.js";

import Repository from "./Repository.js";

import KeymapRepo from "./keymapRepo.js";
import { Coordinates, FilterOptions } from "../types.js";
import Key from "../models/key.js";
import { todayAsDbDate } from "../../utils/time.js";

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

export default class RecordRepo extends Repository<Record> {
  #db: Knex<Record>;
  #keymapRepo: KeymapRepo;

  constructor() {
    super();
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
    let result: Awaited<typeof query>[number];

    try {
      [result] = await query;
      if (!result) {
        throw new Error("Insert did not return a value");
      }
    } catch (error: unknown) {
      throw new DatabaseError("Failed to create record", query, error as Error);
    }

    return new Record(result);
  }

  async getById(id: number): Promise<Record> {
    const query = this.#db(Record.table).where({ id }).first();
    let result: Awaited<typeof query>;

    try {
      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Faild to get record", query, error as Error);
    }

    if (result) return new Record(result);

    throw new NotFoundError(query);
  }

  async getOne(
    options: Pick<Record, "modifiers" | "date" | "keymapId">,
  ): Promise<Record> {
    const { modifiers, date, keymapId } = options;

    const query = this.#db(Record.table)
      .where({
        modifiers: modifiers,
        date: date,
        keymapId: keymapId,
      })
      .first();
    let result: Awaited<typeof query>;

    try {
      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Faild to get record", query, error as Error);
    }

    if (result) return new Record(result);

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

    // If there is already a record for this keycode and modifiers
    // and application on that same day;
    // increment the count
    let existing: Record | null;
    try {
      existing = await this.getOne({
        modifiers,
        date: todayAsDbDate(),
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
      return results.map((result) => new Record(result));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get records", query, error as Error);
    }
  }

  async getKeymapUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<Count[]> {
    const query = this.filterQuery(
      this.#db<Count>(Record.table)
        .select({
          layer: "keymaps.layer",
          row: "keymaps.row",
          column: "keymaps.column",
        })
        .sum("records.counts AS count")
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .where("keymaps.keyboardId", keyboardId)
        .groupBy("keymaps.layer", "keymaps.row", "keymaps.column")
        .orderBy("keymaps.layer", "keymaps.row", "keymaps.column"),
      filter,
    );

    try {
      // NOTE: knex seems to be guessing the type wrong here
      return (await query) as unknown as Count[];
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
    const query = this.filterQuery(
      this.#db(Record.table)
        .select(["keymaps.layer AS layer"])
        .sum("records.counts AS count")
        .where("keymaps.keyboardId", keyboardId)
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .groupBy("layer")
        .orderBy("layer"),
      filter,
    );
    let result: Pick<Count, "layer" | "count">[];

    try {
      // NOTE: knex seems to be guessing the type wrong here
      result = (await query) as unknown as typeof result;
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
    let result: Pick<Count, "row" | "count">[];
    const query = this.filterQuery(
      this.#db(Record.table)
        .select(["keymaps.row AS row"])
        .sum("records.counts AS count")
        .where("keymaps.keyboardId", keyboardId)
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .groupBy("keymaps.row")
        .orderBy("keymaps.row"),
      filter,
    );

    try {
      // NOTE: knex seems to be guessing the type wrong here
      result = (await query) as unknown as typeof result;
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
    const query = this.filterQuery(
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

    try {
      // NOTE: knex seems to be guessing the type wrong here
      result = (await query) as unknown as typeof result;
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
    const query = this.filterQuery(
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

    try {
      // NOTE: knex seems to be guessing the type wrong here
      result = (await query) as unknown as typeof result;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get layer usage",
        query!,
        error as Error,
      );
    }

    return result || [];
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
      // NOTE: knex seems to be guessing the type wrong here
      return (await query) as unknown as RecordCount[];
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
    const query = this.filterQuery(
      this.#db(Record.table)
        .sum("records.counts AS counts")
        .join(Keymap.table, "keymaps.id", "=", "records.keymapId")
        .where("keymaps.keyboardId", keyboardId)
        .first(),
      filter,
    );

    try {
      // NOTE: knex seems to be guessing the type wrong here
      const result = (await query) as unknown as { counts: number };
      return result?.counts || 0;
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
