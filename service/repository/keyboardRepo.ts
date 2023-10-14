import type { Knex } from "knex";

import Repository from "./Repository.js";

import db, { DatabaseError, NotFoundError } from "./../database.js";
import Keyboard from "./../models/keyboard.js";
import type { KeyboardOptions } from "./../models/keyboard.js";

interface CreateKeyboardParams {
  vendorId: number;
  productId: number;
  name: string;
}

export default class KeyboardRepo implements Repository<Keyboard> {
  #db: Knex;

  constructor() {
    this.#db = db;
  }

  build(params: KeyboardOptions): Keyboard {
    return new Keyboard(params);
  }

  async create({
    vendorId,
    productId,
    name,
  }: CreateKeyboardParams): Promise<Keyboard> {
    let result: any;
    let query: Knex.QueryBuilder;

    try {
      query = this.#db(Keyboard.table)
        .update({ vendorId: vendorId, productId: productId, name: name })
        .onConflict(["vendorId", "productId"])
        .merge({ name: name })
        .returning("*");

      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to create keyboard",
        query!,
        error as Error,
      );
    }

    return new Keyboard(result);
  }

  async getAll(): Promise<Keyboard[]> {
    const query = this.#db(Keyboard.table).select();

    try {
      const rows = await query;
      return rows.map((row) => new Keyboard(row));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keyboards", query, error as Error);
    }
  }

  async getById(id: number): Promise<Keyboard> {
    const query = this.#db(Keyboard.table).where({ id }).first();

    let data: any = null;
    try {
      data = await query;

      if (data) {
        return new Keyboard(data);
      }
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keyboard", query, error as Error);
    }

    throw new NotFoundError(query);
  }

  async getByName(name: string): Promise<Keyboard> {
    const query = this.#db(Keyboard.table).where({ name }).first();
    let data: any = null;

    try {
      data = await query;
      if (data) {
        return new Keyboard(data);
      }
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keyboard", query, error as Error);
    }

    throw new NotFoundError(query);
  }

  /**
   * Finds a keyboard by its vendorId and productId
   */
  async getByVendorAndProductId({
    vendorId,
    productId,
  }: Pick<Keyboard, "vendorId" | "productId">): Promise<Keyboard> {
    const query = this.#db(Keyboard.table)
      .where({ vendorId, productId })
      .first();
    let data: any = null;

    try {
      data = await query;
      if (data) {
        return new Keyboard(data);
      }
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keyboard", query, error as Error);
    }
    throw new NotFoundError(query);
  }

  async update(keyboard: Keyboard): Promise<Keyboard> {
    if (!keyboard.id) {
      throw new Error("Cannot update a keyboard without an id");
    }

    let update: any = null;
    let error: Error | null = null;
    const query = this.#db(Keyboard.table)
      .update({ name: keyboard.name })
      .where({ id: keyboard.id })
      .returning("*");

    try {
      const exists = await this.getById(keyboard.id);

      if (exists) {
        [update] = await query;
      }
    } catch (err: unknown) {
      error = err as Error;
    }
    if (update) {
      return new Keyboard(update);
    }

    throw new DatabaseError("Failed to update keyboard", query, error);
  }

  async delete(keyboardId: number): Promise<void> {
    const query = this.#db(Keyboard.table).where({ id: keyboardId }).del();
    try {
      await this.getById(keyboardId);
      await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to delete keyboard",
        query,
        error as Error,
      );
    }
  }
}
