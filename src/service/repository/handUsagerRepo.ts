import { Knex } from "knex";
import HandUsage, { HandUsageOptions } from "../models/handUsage.js";
import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import { FilterOptions } from "../types.js";
import { todayAsDbDate } from "../../utils/time.js";

export default class HandUsageRepo extends Repository<HandUsage> {
  #db: Knex<HandUsage>;

  constructor() {
    super();
    this.#db = db;
  }

  build(data: HandUsageOptions) {
    return new HandUsage(data);
  }

  async create(data: HandUsage): Promise<HandUsage> {
    const query = this.#db(HandUsage.table)
      .insert({
        keyboardId: data.keyboardId,
        hand: data.hand,
        repeats: data.repeats,
        date: data.date,
        count: data.count || 1,
      })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      result = (await query) as any;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to create hand usage",
        query!,
        error as Error,
      );
    }

    return new HandUsage(result);
  }

  async getById(_id: number): Promise<HandUsage> {
    throw new Error("Not Implemented");
  }

  async getOne({
    keyboardId,
    hand,
    repeats,
    date,
  }: Omit<HandUsageOptions, "count">): Promise<HandUsage> {
    const query = this.#db(HandUsage.table)
      .where({
        keyboardId,
        hand,
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
      return new HandUsage(result);
    }

    throw new NotFoundError(query);
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

  async incrementHandUsage(
    keyboardId: number,
    hand: number,
    repeats: number,
  ): Promise<void> {
    if (repeats === 0) {
      return;
    }

    let query;

    try {
      const exists = await this.getOne({
        keyboardId: keyboardId,
        hand: hand,
        date: todayAsDbDate(),
        repeats: repeats,
      });

      query = this.#db(HandUsage.table)
        .update({ count: exists.count + 1, updatedAt: new Date() })
        .where({ id: exists.id })
        .returning("*");

      await query;

      return;
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        const data = this.build({
          keyboardId: keyboardId,
          hand: hand,
          repeats: repeats,
          date: todayAsDbDate(),
          count: 1,
        });

        await this.create(data);
        return;
      }

      throw new DatabaseError(
        "Failed to increment hand usage",
        query!,
        error as Error,
      );
    }
  }

  async getAll(): Promise<HandUsage[]> {
    const query = this.#db(HandUsage.table).select();
    const result = await query;
    return result.map((item) => new HandUsage(item));
  }

  async getForKeyboard(
    keyboardId: number,
    filters: FilterOptions = {},
  ): Promise<HandUsage[]> {
    const query = this.filterQuery(
      this.#db(HandUsage.table).select().where({ keyboardId: keyboardId }),
      filters,
    );

    try {
      const result = await query;
      return result.map((item) => new HandUsage(item));
    } catch (e) {
      console.log(query.toSQL().toNative());
      return [];
    }
  }

  async update(data: HandUsage): Promise<HandUsage> {
    await this.getById(data.id!);

    const query = this.#db(HandUsage.table)
      .where("id", data.id)
      .update({ count: data.count, updatedAt: data.updatedAt })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to update hand usage",
        query,
        error as Error,
      );
    }
    if (result) {
      return new HandUsage(result);
    }

    throw new NotFoundError(query);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    const query = this.#db(HandUsage.table).where("id", id).del();

    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to delete hand usage",
        query,
        error as Error,
      );
    }
  }
}
