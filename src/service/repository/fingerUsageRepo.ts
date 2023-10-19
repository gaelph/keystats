import { Knex } from "knex";
import FingerUsage, { FingerUsageOptions } from "../models/fingerUsage.js";
import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import { FilterOptions } from "../types.js";
import { todayAsDbDate } from "../../utils/time.js";

export default class FingerUsageRepo extends Repository<FingerUsage> {
  #db: Knex<FingerUsage>;

  constructor() {
    super();
    this.#db = db;
  }

  build(data: FingerUsageOptions) {
    return new FingerUsage(data);
  }

  async create(data: FingerUsage): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table)
      .insert({
        keyboardId: data.keyboardId,
        finger: data.finger,
        repeats: data.repeats,
        date: data.date,
        count: data.count || 1,
      })
      .onConflict(["keyboardId", "finger", "repeats", "date"])
      .merge({
        count: data.count,
      })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to create finger usage",
        query!,
        error as Error,
      );
    }

    return new FingerUsage(result);
  }

  async getById(id: number): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table).where("id", id).first();
    let result: Awaited<typeof query>;

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
    const query = this.#db(FingerUsage.table)
      .where({
        keyboardId,
        finger,
        repeats,
        date,
      })
      .first();
    let result: Awaited<typeof query>;

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

  async getForKeyboard(
    keyboardId: number,
    filters: FilterOptions = {},
  ): Promise<FingerUsage[]> {
    const query = this.filterQuery(
      this.#db(FingerUsage.table).select().where({ keyboardId: keyboardId }),
      filters,
    );

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

    try {
      const exists = await this.getOne({
        keyboardId,
        finger,
        repeats,
        date: todayAsDbDate(),
      });

      exists.count += 1;

      await this.update(exists);

      return;
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        await this.create(
          this.build({
            keyboardId: keyboardId,
            finger: finger,
            date: today,
            repeats: repeats,
            count: 1,
          }),
        );

        return;
      }

      throw error;
    }
  }

  async update(data: FingerUsage): Promise<FingerUsage> {
    const query = this.#db(FingerUsage.table)
      .where("id", data.id)
      .update({ count: data.count })
      .returning("count");
    let result: Awaited<typeof query>[number];

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
