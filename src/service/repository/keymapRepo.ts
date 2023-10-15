import type { Knex } from "knex";
import Keymap, { KeymapOptions, KeymapType } from "../models/keymap.js";

import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import { Coordinates } from "../types.js";

export default class KeymapRepository implements Repository<Keymap> {
  #db: Knex;

  constructor() {
    this.#db = db;
  }

  build(data: KeymapOptions): Keymap {
    return new Keymap(data);
  }

  async create(data: Keymap): Promise<Keymap> {
    let result: any;
    let query: Knex.QueryBuilder;

    try {
      query = this.#db<Keymap>(Keymap.table)
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
      const row = await query;

      if (row) return new Keymap(row);
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymap", query!, error as Error);
    }

    throw new NotFoundError(query);
  }

  async getAll(): Promise<Keymap[]> {
    const query = this.#db(Keymap.table).select();

    try {
      const rows = await query;

      return rows.map((row) => new Keymap(row));
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
    let result: any;
    let query: Knex.QueryBuilder;
    const { layer, row, column } = coordinates;

    try {
      query = this.#db<Keymap>(Keymap.table)
        .where({
          keyboardId,
          layer,
          row,
          column,
          type,
        })
        .first();

      if (keycode) {
        query = query.andWhere({ keycode });
      }

      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymaps", query!, error as Error);
    }

    if (result) return new Keymap(result);

    throw new NotFoundError(query!);
  }

  /* async getKeymapAtCoordinates(
    keyboardId: number,
    layerIndex: number,
    column: number,
    row: number,
    keycode: string,
    type: KeymapType,
  ): Promise<Keymap> {
    let result: any;
    const query = this.#db
      .select<Keymap>([{ id: "keymaps.id" }])
      .from(Keymap.table)
      .join(Layer.table, function () {
        this.on("layers.id", "=", "keymaps.layerId");
      })
      .join(Key.table, function () {
        this.on("keys.id", "=", "keymaps.keyId");
      })
      .where({
        "keymaps.keycode": keycode,
        "keymaps.type": type,
        "layers.keyboardId": keyboardId,
        "keys.column": column,
        "keys.row": row,
      })
      .andWhere("layers.index", "<=", layerIndex)
      .orderBy("layers.index", "desc");

    try {
      result = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymaps", query, error as Error);
    }

    if (result) return new Keymap(result[0]);

    throw new NotFoundError(query);
  } */

  async getByKeyboard(keyboardId: number): Promise<Keymap[]> {
    const query = this.#db<Keymap>(Keymap.table)
      .select("id", "keycode", "type", "layer", "column", "row", "keyboardId")
      .where("keyboardId", keyboardId)
      .orderBy(["layer", "row", "column"]);

    try {
      const rows = await query;
      return rows.map((row) => new Keymap(row));
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
    const query = this.#db<Keymap>(Keymap.table)
      .where({ id: data.id })
      .update({ keycode: data.keycode })
      .returning("*");
    let result: Keymap;

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
    const query = this.#db<Keymap>(Keymap.table).where("layer", layer).del();
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
}
