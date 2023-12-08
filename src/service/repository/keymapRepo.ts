import type { Knex } from "knex";
import Keymap, { KeymapOptions, KeymapType } from "../models/keymap.js";

import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import { Coordinates } from "../types.js";

export default class KeymapRepository extends Repository<Keymap> {
  #db: Knex<Keymap>;

  constructor() {
    super();
    this.#db = db;
  }

  build(data: KeymapOptions): Keymap {
    return new Keymap(data);
  }

  async create(data: Keymap): Promise<Keymap> {
    const query = this.#db<Keymap>(Keymap.table)
      .insert({
        keycode: data.keycode,
        type: data.type,
        keyboardId: data.keyboardId,
        layer: data.layer,
        column: data.column,
        row: data.row,
      })
      .onConflict(["keyboardId", "layer", "row", "column", "type"])
      .merge({ keycode: data.keycode })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to create keymap",
        query!,
        error as Error,
      );
    }

    return new Keymap(result);
  }

  async getById(id: number): Promise<Keymap> {
    const query = this.#db<Keymap>(Keymap.table).where({ id }).first();

    try {
      const result = await query;

      if (result) return new Keymap(result);
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymap", query!, error as Error);
    }

    throw new NotFoundError(query);
  }

  async getAll(): Promise<Keymap[]> {
    const query = this.#db(Keymap.table).select();

    try {
      const results = await query;

      return results.map((row) => new Keymap(row));
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymaps", query, error as Error);
    }
  }

  async getOne(
    keyboardId: number,
    coordinates: Coordinates,
    type: KeymapType,
    keycode?: string,
  ): Promise<Keymap> {
    const { layer, row, column } = coordinates;
    let query = this.#db(Keymap.table)
      .where({
        keyboardId,
        layer,
        row,
        column,
        type,
      })
      .first();
    let result: Awaited<typeof query>;

    try {
      if (keycode) {
        query = query.andWhere({ keycode });
      }

      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymaps", query, error as Error);
    }

    if (result) return new Keymap(result);

    throw new NotFoundError(query);
  }

  async getByKeyboard(keyboardId: number): Promise<Keymap[]> {
    const query = this.#db(Keymap.table)
      .select("id", "keycode", "type", "layer", "column", "row", "keyboardId")
      .where("keyboardId", keyboardId)
      .orderBy(["layer", "row", "column"]);

    try {
      const result = await query;
      return result.map((row) => new Keymap(row));
    } catch (error: unknown) {
      console.error(error);
      throw new DatabaseError(
        "Failed to get keyboard keymaps",
        query,
        error as Error,
      );
    }
  }

  async update(data: Keymap): Promise<Keymap> {
    await this.getById(data.id!);
    const query = this.#db(Keymap.table)
      .where({ id: data.id })
      .update({ keycode: data.keycode })
      .returning("*");
    let result: Awaited<typeof query>[number];

    try {
      [result] = await query;
      return new Keymap(result);
    } catch (error: unknown) {
      throw new DatabaseError("Failed to update keymap", query, error as Error);
    }
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    const query = this.#db(Keymap.table).where({ id: id }).del();

    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to delete keymap", query, error as Error);
    }
  }

  async deleteKeymapsOfLayer(layer: number): Promise<void> {
    const query = this.#db(Keymap.table).where("layer", layer).del();
    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Failed to delete keymaps of layer",
        query,
        error as Error,
      );
    }
  }

  /**
   * Removes all keymaps of a keyboard that is not in the keymap
   * list past as first parameter
   */
  async cleanUp(
    keymaps: Keymap[],
    layer: number,
    keyboardId: number,
  ): Promise<void> {
    const query = this.#db(Keymap.table)
      .where("keyboardId", keyboardId)
      .where("layer", layer)
      .whereNotIn(
        "id",
        keymaps.map((keymap) => keymap.id!),
      )
      .del();

    try {
      await query;
    } catch (error: unknown) {
      throw new DatabaseError(
        "Keymaps Cleanup failed on keyboard",
        query,
        error as Error,
      );
    }
  }
}
