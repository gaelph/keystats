import { Knex } from "knex";
import { FilterOptions } from "../types.js";
import { toDbDate } from "../../utils/time.js";

export default abstract class Repository<T> {
  abstract build(data: any): T;

  abstract create(data: T): Promise<T>;
  abstract getById(id: number): Promise<T>;
  abstract getAll(): Promise<T[]>;
  abstract update(data: T): Promise<T>;
  abstract delete(id: number): Promise<void>;

  filterQuery<T extends Knex.QueryBuilder>(
    query: T,
    options: FilterOptions = {},
  ): T {
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
      query.whereBetween("date", [toDbDate(period[0]), toDbDate(period[1])]);
    }
    if (after) {
      query.where("date", ">=", toDbDate(after));
    }
    if (before) {
      query.where("date", "<=", toDbDate(before));
    }
    if (date) {
      query.where("date", "=", toDbDate(date));
    }
    if (type) {
      query.where("keymaps.type", "=", type);
    }

    return query;
  }
}
