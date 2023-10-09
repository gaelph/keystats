import type { Knex } from "knex";

import Repository from "./Repository.js";

import { DatabaseError, DatabaseRecordNotFoundError } from "./../database.js";
import Keyboard from "./../models/keyboard.js";
import type { KeyboardOptions } from "./../models/keyboard.js";

interface CreateKeyboardParams {
  vendorId: number;
  productId: number;
  name: string;
}

export default class KeyboardRepo implements Repository<Keyboard> {
  #db: Knex;

  constructor(db: Knex) {
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
    const existing = await this.getByVendorAndProductId({
      vendorId,
      productId,
    });
    if (existing) {
      const [updated] = await this.#db(Keyboard.table)
        .update({ name })
        .where({ id: existing.id })
        .returning(["id", "name", "vendorId", "productId"]);
      return new Keyboard(updated);
    }

    const [inserted] = await this.#db(Keyboard.table).insert(
      [{ vendorId, productId, name }],
      ["id", "vendorId", "productId", "name"],
    );

    if (inserted) {
      return new Keyboard(inserted);
    }

    throw new DatabaseError("Failed to create keyboard", null);
  }

  async getAll(): Promise<Keyboard[]> {
    const rows = await this.#db(Keyboard.table).select();

    return rows.map((row) => new Keyboard(row));
  }

  async getById(id: number): Promise<Keyboard> {
    const data = await this.#db(Keyboard.table).where({ id }).first();

    if (data) {
      return new Keyboard(data);
    }

    throw new DatabaseRecordNotFoundError(Keyboard);
  }

  async getByName(name: string): Promise<Keyboard> {
    const data = await this.#db(Keyboard.table).where({ name }).first();

    if (data) {
      return new Keyboard(data);
    }

    throw new DatabaseRecordNotFoundError(Keyboard);
  }

  /**
   * Finds a keyboard by its vendorId and productId
   */
  async getByVendorAndProductId({
    vendorId,
    productId,
  }: {
    vendorId: number;
    productId: number;
  }): Promise<Keyboard> {
    const data = await this.#db(Keyboard.table)
      .where({ vendorId, productId })
      .first();

    if (data) {
      return new Keyboard(data);
    }

    throw new DatabaseRecordNotFoundError(Keyboard);
  }

  async update(keyboard: Keyboard): Promise<Keyboard> {
    if (!keyboard.id) {
      throw new Error("Cannot update a keyboard without an id");
    }

    const exits = await this.getById(keyboard.id);
    if (!exits) {
      throw new DatabaseRecordNotFoundError(Keyboard);
    }

    const nUpdated = await this.#db(Keyboard.table)
      .update({ name: keyboard.name })
      .where({ id: keyboard.id });

    if (nUpdated > 0) {
      return keyboard;
    }

    throw new DatabaseError("Failed to update keyboard", null);
  }

  async delete(keyboardId: number): Promise<void> {
    const exits = await this.getById(keyboardId);
    if (!exits) {
      throw new DatabaseRecordNotFoundError(Keyboard);
    }

    await this.#db(Keyboard.table).where({ id: keyboardId }).del();
  }
}
