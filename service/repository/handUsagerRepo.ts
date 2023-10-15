import { Knex } from "knex";
import HandUsage, { HandUsageOptions } from "../models/handUsage.js";
import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import { FilterOptions } from "../types.js";

export default class HandUsageRepo implements Repository<HandUsage> {
  #db: Knex;

  constructor() {
    this.#db = db;
  }

  build(data: HandUsageOptions) {
    return new HandUsage(data);
  }

  async create(data: HandUsage): Promise<HandUsage> {
    let result: any;
    let query: Knex.QueryBuilder;

    try {
      query = this.#db(HandUsage.table)
        .insert({
          keyboardId: data.keyboardId,
          hand: data.hand,
          repeats: data.repeats,
          date: data.date,
          count: data.count || 1,
        })
        .returning("*");

      result = await query;
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
    let result: any = null;
    const query = this.#db(HandUsage.table)
      .where({
        keyboardId,
        hand,
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

    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    let query: Knex.QueryBuilder | undefined = undefined;

    try {
      const exists = await this.getOne({
        keyboardId: keyboardId,
        hand: hand,
        date: today,
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
          date: today,
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
      return result.map((item: any) => new HandUsage(item));
    } catch (e) {
      console.log(query.toSQL().toNative());
      return [];
    }
  }

  async update(data: HandUsage): Promise<HandUsage> {
    await this.getById(data.id!);

    let result: any;
    const query = this.#db(HandUsage.table)
      .where("id", data.id)
      .update({ count: data.count, updatedAt: data.updatedAt })
      .returning("*");

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
  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
