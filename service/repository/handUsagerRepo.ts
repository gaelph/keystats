import { Knex } from "knex";
import HandUsage, { HandUsageOptions } from "../models/handUsage.js";
import Repository from "./Repository.js";
import { DatabaseError, DatabaseRecordNotFoundError } from "../database.js";

export default class HandUsageRepo implements Repository<HandUsage> {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  build(data: HandUsageOptions) {
    return new HandUsage(data);
  }

  async create(data: HandUsage): Promise<HandUsage> {
    const query = this.#db(HandUsage.table).insert(data).returning("*");

    const [result] = await query;
    if (!result) {
      console.log(query.toSQL().toNative());
      throw new DatabaseRecordNotFoundError(HandUsage);
    }

    data.id = result.id;
    data.createdAt = result.createdAt;
    data.updatedAt = result.updatedAt;

    return data;
  }

  async getById(id: number): Promise<HandUsage> {
    const query = this.#db(HandUsage.table).where("id", id).first();
    const result = await query;

    if (!result) {
      console.log(query.toSQL().toNative());
      throw new DatabaseRecordNotFoundError(HandUsage);
    }

    return new HandUsage(result);
  }

  async getByHand(keyboardId: number, hand: number): Promise<HandUsage[]> {
    const query = this.#db(HandUsage.table).where({
      keyboardId: keyboardId,
      hand: hand,
    });

    const results = await query;
    return results.map((r) => new HandUsage(r));
  }

  async getByHandWithRepeats(
    keyboardId: number,
    hand: number,
    repeats: number,
  ): Promise<HandUsage[]> {
    const query = this.#db(HandUsage.table).where({
      keyboardId: keyboardId,
      hand: hand,
      repeats: repeats,
    });

    const results = await query;
    return results.map((r) => new HandUsage(r));
  }

  async getLatest(keyboardId: number): Promise<HandUsage> {
    const query = this.#db(HandUsage.table)
      .where({
        keyboardId: keyboardId,
      })
      .orderBy("updatedAt", "desc")
      .first();

    const result = await query;
    if (!result) {
      throw new DatabaseRecordNotFoundError(HandUsage);
    }

    return new HandUsage(result);
  }

  async incrementHandUsage(
    keyboardId: number,
    hand: number,
    repeats: number,
  ): Promise<HandUsage> {
    const exists = await this.#db(HandUsage.table)
      .where({
        keyboardId: keyboardId,
        hand: hand,
        repeats: repeats,
      })
      .first();

    if (!exists) {
      const data = this.build({
        keyboardId: keyboardId,
        hand: hand,
        repeats: repeats,
        count: 1,
      });

      const result = await this.create(data);
      return result;
    }

    const [result] = await this.#db(HandUsage.table)
      .update({ count: exists.count + 1, updatedAt: new Date() })
      .where({ id: exists.id })
      .returning("*");

    return new HandUsage(result);
  }

  async getAll(): Promise<HandUsage[]> {
    const query = this.#db(HandUsage.table).select();
    const result = await query;
    return result.map((item) => new HandUsage(item));
  }

  async getForKeyboard(keyboardId: number): Promise<HandUsage[]> {
    const query = this.#db(HandUsage.table)
      .select()
      .where({ keyboardId: keyboardId });

    try {
      const result = await query;
      return result.map((item) => new HandUsage(item));
    } catch (e) {
      console.log(query.toSQL().toNative());
      return [];
    }
  }

  async update(data: HandUsage): Promise<HandUsage> {
    const exists = await this.getById(data.id!);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(HandUsage);
    }

    const query = this.#db(HandUsage.table)
      .where("id", data.id)
      .update({ count: data.count, updatedAt: data.updatedAt })
      .returning(["count", "updatedAt"]);
    const [result] = await query;

    if (!result) {
      console.log(query.toSQL().toNative());
      throw new DatabaseError("Could not update hand usage", null);
    }

    data.count = result.count;
    data.updatedAt = result.updatedAt;
    return data;
  }

  async delete(id: number): Promise<void> {
    const exists = await this.getById(id);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(HandUsage);
    }
    await this.#db(HandUsage.table).where("id", id).del();
  }
}
