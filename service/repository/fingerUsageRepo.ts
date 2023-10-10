import { Knex } from "knex";
import FingerUsage, { FingerUsageOptions } from "../models/fingerUsage.js";
import Repository from "./Repository.js";
import { DatabaseError, DatabaseRecordNotFoundError } from "../database.js";

export default class FingerUsageRepo implements Repository<FingerUsage> {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  build(data: FingerUsageOptions) {
    return new FingerUsage(data);
  }

  async create(data: FingerUsage): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table).insert(data).returning("id");

    const [result] = await query;
    if (!result) {
      console.log(query.toSQL().toNative());
      throw new DatabaseRecordNotFoundError(FingerUsage);
    }

    data.id = result.id;

    return data;
  }

  async getById(id: number): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table).where("id", id).first();
    const result = await query;

    if (!result) {
      console.log(query.toSQL().toNative());
      throw new DatabaseRecordNotFoundError(FingerUsage);
    }

    return new FingerUsage(result);
  }

  async getByFinger(
    keyboardId: number,
    finger: number,
  ): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table).where({
      keyboardId: keyboardId,
      finger: finger,
    });

    const results = await query;
    return results.map((r) => new FingerUsage(r));
  }

  async getByFingerWithRepeats(
    keyboardId: number,
    finger: number,
    repeats: number,
  ): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table).where({
      keyboardId: keyboardId,
      finger: finger,
      repeats: repeats,
    });

    const results = await query;
    return results.map((r) => new FingerUsage(r));
  }

  async getAll(): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table).select();
    const result = await query;
    return result.map((item) => new FingerUsage(item));
  }

  async getLatest(keyboardId: number): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table)
      .where({
        keyboardId: keyboardId,
      })
      .orderBy("updatedAt", "desc")
      .first();

    const result = await query;
    if (!result) {
      throw new DatabaseRecordNotFoundError(FingerUsage);
    }

    return new FingerUsage(result);
  }

  async getForKeyboard(keyboardId: number): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table)
      .select()
      .where({ keyboardId: keyboardId });

    try {
      const result = await query;
      return result.map((item) => new FingerUsage(item));
    } catch (e) {
      console.log(query.toSQL().toNative());
      return [];
    }
  }

  async incrementFingerUsage(
    keyboardId: number,
    finger: number,
    repeats: number,
  ): Promise<FingerUsage> {
    const exists = await this.#db(FingerUsage.table)
      .where({
        keyboardId: keyboardId,
        finger: finger,
        repeats: repeats,
      })
      .first();

    if (!exists) {
      const data = this.build({
        keyboardId: keyboardId,
        finger: finger,
        repeats: repeats,
        count: 1,
      });

      const result = await this.create(data);
      return result;
    }

    const [result] = await this.#db(FingerUsage.table)
      .update({ count: exists.count + 1, updatedAt: new Date() })
      .where({ id: exists.id })
      .returning("*");

    return new FingerUsage(result);
  }

  async update(data: FingerUsage): Promise<FingerUsage> {
    const exists = await this.getById(data.id!);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(FingerUsage);
    }

    const query = this.#db(FingerUsage.table)
      .where("id", data.id)
      .update({ count: data.count })
      .returning("count");
    const [result] = await query;

    if (!result) {
      console.log(query.toSQL().toNative());
      throw new DatabaseError("Could not update finger usage", null);
    }

    data.count = result.count;
    return data;
  }

  async delete(id: number): Promise<void> {
    const exists = await this.getById(id);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(FingerUsage);
    }
    await this.#db(FingerUsage.table).where("id", id).del();
  }
}
