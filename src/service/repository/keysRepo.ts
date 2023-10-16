import type { Knex } from "knex";
import Key, { KeyOptions } from "../models/key.js";
import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";

export default class KeysRepo implements Repository<Key> {
  #db: Knex<Key>;

  constructor() {
    this.#db = db;
  }

  build(data: KeyOptions): Key {
    return new Key(data);
  }

  async create(data: Key): Promise<Key> {
    const query = this.#db(Key.table)
      .insert({
        keyboardId: data.keyboardId,
        column: data.column,
        row: data.row,
        hand: data.hand,
        finger: data.finger,
      })
      .onConflict(["keyboardId", "column", "row"])
      .merge({
        hand: data.hand,
        finger: data.finger,
      })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to create key", query!, error as Error);
    }

    return new Key(result);
  }

  async getById(_id: number): Promise<Key> {
    throw new Error("Method not implemented.");
  }

  async getAtCoordinates(
    keyboardId: number,
    column: number,
    row: number,
  ): Promise<Key> {
    const query = this.#db<Key>(Key.table)
      .where({
        keyboardId,
        column,
        row,
      })
      .first();
    let result: Awaited<typeof query>;

    try {
      result = await query;
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
    const query = this.#db(Key.table)
      .where({
        keyboardId: data.keyboardId,
        column: data.column,
        row: data.row,
      })
      .update({ hand: data.hand, finger: data.finger })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      await this.getAtCoordinates(data.keyboardId, data.column, data.row);
      [result] = await query;

      return new Key(result);
    } catch (error: unknown) {
      throw new DatabaseError("Could not update key", query, error as Error);
    }
  }

  async delete(_id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteKey(key: Key): Promise<void> {
    const query = this.#db(Key.table)
      .where({ keyboardId: key.keyboardId, column: key.column, row: key.row })
      .del();
    await this.getAtCoordinates(key.keyboardId, key.column, key.row);

    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError("Could not delete key", query, error as Error);
    }
  }
}
