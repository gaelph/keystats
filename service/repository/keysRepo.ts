import type { Knex } from "knex";
import Key, { KeyOptions } from "../models/key.js";
import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";

export default class KeysRepo implements Repository<Key> {
  #db: Knex;

  constructor() {
    this.#db = db;
  }

  build(data: KeyOptions): Key {
    return new Key(data);
  }

  async create(data: Key): Promise<Key> {
    let query: Knex.QueryBuilder;
    let result;

    try {
      const exists = await this.getAtCoordinates(
        data.keyboardId,
        data.column,
        data.row,
      );

      query = this.#db(Key.table)
        .update({
          keyboardId: data.keyboardId,
          column: data.column,
          row: data.row,
          hand: data.hand,
          finger: data.finger,
        })
        .where({ id: exists.id })
        .returning("*");
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        query = this.#db(Key.table)
          .insert({
            keyboardId: data.keyboardId,
            column: data.column,
            row: data.row,
            hand: data.hand,
            finger: data.finger,
          })
          .returning("*");
      } else {
        throw new DatabaseError("Failed to create key", query!, error as Error);
      }
    }

    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to create key", query!, error as Error);
    }

    return new Key(result);
  }

  async createKeysWithLayout(
    keyboardId: number,
    layout: number[][],
  ): Promise<Key[]> {
    try {
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
            return await this.create(this.build(value));
          }),
      );

      return keys;
    } catch (error: unknown) {
      throw new DatabaseError("Could not create keys", null, error as Error);
    }
  }

  async getById(_id: number): Promise<Key> {
    throw new Error("Method not implemented.");
  }

  async getAtCoordinates(
    keyboardId: number,
    column: number,
    row: number,
  ): Promise<Key> {
    let result: Key | undefined;
    const query = this.#db<Key>(Key.table).where({
      keyboardId,
      column,
      row,
    });

    try {
      result = await query.first();
    } catch (error: unknown) {
      throw new DatabaseError("Could not find key", query, error as Error);
    }

    if (result) {
      return new Key(result);
    }

    throw new NotFoundError(query);
  }

  async getAll(): Promise<Key[]> {
    throw new Error("Method not implemented.");
  }

  async update(data: Key): Promise<Key> {
    let result: any;
    const query = this.#db<Key>(Key.table)
      .where({ id: data.id })
      .update({ hand: data.hand, finger: data.finger });

    try {
      await this.getById(data.id!);
      result = await query;
      return new Key(result);
    } catch (error: unknown) {
      throw new DatabaseError("Could not update key", query, error as Error);
    }
  }

  async delete(id: number): Promise<void> {
    const query = this.#db(Key.table).where({ id: id }).del();
    await this.getById(id);

    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError("Could not delete key", query, error as Error);
    }
  }
}
