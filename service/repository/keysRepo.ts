import type { Knex } from "knex";
import Key, { KeyOptions } from "../models/key.js";
import Repository from "./Repository.js";
import { DatabaseRecordNotFoundError } from "../database.js";

export default class KeysRepo implements Repository<Key> {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  build(data: KeyOptions): Key {
    return new Key(data);
  }

  async create(data: Key): Promise<Key> {
    const [row] = await this.#db(Key.table).insert(data).returning("id");
    if (!row) {
      throw new Error("Could not create key");
    }

    data.id = row.id;
    return data;
  }

  async createKeysWithLayout(
    keyboardId: number | undefined,
    layout: number[][],
  ): Promise<Key[]> {
    if (keyboardId === undefined) {
      throw new Error("keyboardId is undefined");
    }

    const keys = await Promise.all(
      layout
        .flatMap((rowData, row) => {
          return rowData.map((finger, column) => {
            const hand = finger < 5 ? 0 : 1;
            return {
              column,
              row,
              finger,
              hand,
              keyboardId,
            };
          });
        })
        .map(async (value) => {
          const key = await this.#db(Key.table)
            .select("id")
            .where({ keyboardId, column: value.column, row: value.row })
            .first();

          if (key) {
            return (await this.#db(Key.table)
              .where({ id: key.id })
              .update({ finger: value.finger, hand: value.hand })
              .returning("*")) as Key[];
          }

          return (await this.#db(Key.table)
            .insert(value)
            .returning("*")) as Key[];
        }),
    );

    return keys.flat().map((key) => new Key(key));
  }

  async getById(id: number): Promise<Key> {
    const row = await this.#db(Key.table).where({ id }).first();
    if (!row) {
      throw new DatabaseRecordNotFoundError(Key);
    }
    return new Key(row);
  }

  async getAtCoordinates(
    keyboardId: number,
    column: number,
    row: number,
  ): Promise<Key | null> {
    const query = this.#db(Key.table).where({
      keyboardId,
      column,
      row,
    });

    const result = await query.first();
    if (!result) {
      console.log(`Key not found: ${keyboardId}, ${column}, ${row}`);
      return null;
    }

    return new Key(result);
  }

  async getAll(): Promise<Key[]> {
    const rows = await this.#db(Key.table).select("*");
    return rows.map((row) => new Key(row));
  }

  async update(data: Key): Promise<Key> {
    if (data.id === undefined) {
      throw new Error("Key.id is undefined");
    }
    const existing = await this.getById(data.id);
    if (!existing) {
      throw new DatabaseRecordNotFoundError(Key);
    }

    await this.#db(Key.table)
      .where({ id: data.id })
      .update({ hand: data.hand, finger: data.finger });

    return data;
  }

  async delete(id: number): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new DatabaseRecordNotFoundError(Key);
    }

    await this.#db(Key.table).where({ id: id }).del();
  }
}
