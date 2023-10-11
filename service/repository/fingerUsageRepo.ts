import { Knex } from "knex";
import FingerUsage, { FingerUsageOptions } from "../models/fingerUsage.js";
import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";

export default class FingerUsageRepo implements Repository<FingerUsage> {
  #db: Knex;

  constructor() {
    this.#db = db;
  }

  build(data: FingerUsageOptions) {
    return new FingerUsage(data);
  }

  async create(data: FingerUsage): Promise<FingerUsage> {
    let result: any;
    let query: Knex.QueryBuilder;
    try {
      const exists = await this.getOne({
        keyboardId: data.keyboardId,
        finger: data.finger,
        repeats: data.repeats,
        date: data.date,
      });

      query = this.#db(FingerUsage.table)
        .update({
          keyboardId: data.keyboardId,
          finger: data.finger,
          repeats: data.repeats,
          date: data.date,
          count: data.count,
        })
        .where({ id: exists.id })
        .returning("*");
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        query = this.#db(FingerUsage.table)
          .insert({
            keyboardId: data.keyboardId,
            finger: data.finger,
            repeats: data.repeats,
            date: data.date,
            count: data.count || 1,
          })
          .returning("*");
      } else {
        throw new DatabaseError(
          "Failed to create finger usage",
          query!,
          error as Error,
        );
      }
    }

    try {
      [result] = await query;

      if (!result) {
        throw new DatabaseError("Insert did not return a result", query);
      }
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to create finger usage",
        query,
        error as Error,
      );
    }

    return new FingerUsage(result);
  }

  async getById(id: number): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table).where("id", id).first();
    let result: any;

    try {
      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get finger usage",
        query,
        error as Error,
      );
    }

    if (result) {
      return new FingerUsage(result);
    }

    throw new NotFoundError(query);
  }

  async getByFinger(
    keyboardId: number,
    finger: number,
  ): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table).where({
      keyboardId: keyboardId,
      finger: finger,
    });

    try {
      const results = await query;
      return results.map((r) => new FingerUsage(r));
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get finger usage",
        query,
        error as Error,
      );
    }
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

    try {
      const results = await query;
      return results.map((r) => new FingerUsage(r));
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get finger usage",
        query,
        error as Error,
      );
    }
  }

  async getOne({
    keyboardId,
    finger,
    repeats,
    date,
  }: Omit<FingerUsageOptions, "count">): Promise<FingerUsage> {
    let result: any = null;
    const query = this.#db(FingerUsage.table)
      .where({
        keyboardId,
        finger,
        repeats,
        date,
      })
      .first();

    try {
      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get finger usage",
        query,
        error as Error,
      );
    }

    if (result) {
      return new FingerUsage(result);
    }

    throw new NotFoundError(query);
  }

  async getAll(): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table).select();

    try {
      const result = await query;
      return result.map((item) => new FingerUsage(item));
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get finger usage",
        query,
        error as Error,
      );
    }
  }

  async getForKeyboard(keyboardId: number): Promise<FingerUsage[]> {
    const query = this.#db(FingerUsage.table)
      .select()
      .where({ keyboardId: keyboardId });

    try {
      const result = await query;
      return result.map((item) => new FingerUsage(item));
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to get finger usage",
        query,
        error as Error,
      );
    }
  }

  async incrementFingerUsage(
    keyboardId: number,
    finger: number,
    repeats: number,
  ): Promise<void> {
    if (repeats < 1) {
      return;
    }

    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    let query: Knex.QueryBuilder | undefined = undefined;

    try {
      const exists = await this.getOne({
        keyboardId,
        finger,
        repeats,
        date: today,
      });

      query = this.#db(FingerUsage.table)
        .update({ count: exists.count + 1, updatedAt: new Date() })
        .where({ id: exists.id })
        .returning("*");

      await query;

      return;
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        const data = this.build({
          keyboardId: keyboardId,
          finger: finger,
          date: today,
          repeats: repeats,
          count: 1,
        });

        await this.create(data);
        return;
      }

      throw new DatabaseError(
        "Failed to increment finger usage",
        query!,
        error as Error,
      );
    }
  }

  async update(data: FingerUsage): Promise<FingerUsage> {
    let result: any = null;
    const query = this.#db(FingerUsage.table)
      .where("id", data.id)
      .update({ count: data.count })
      .returning("count");

    try {
      await this.getById(data.id!);
      [result] = await query;

      data.count = result.count;
      return data;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to update finger usage",
        query,
        error as Error,
      );
    }
  }

  async delete(id: number): Promise<void> {
    const query = this.#db(FingerUsage.table).where("id", id).del();
    try {
      await this.getById(id);
      await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to delete finger usage",
        query,
        error as Error,
      );
    }
  }
}
