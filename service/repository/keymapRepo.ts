import type { Knex } from "knex";
import Keymap, { KeymapOptions, KeymapType } from "../models/keymap.js";

import Repository from "./Repository.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import Key from "../models/key.js";
import Layer from "../models/layer.js";

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
      const exsits = await this.getOne(data.layerId, data.keyId, data.type);

      query = this.#db(Keymap.table)
        .update({ keycode: data.keycode })
        .where({ id: exsits.id })
        .returning("*");
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        query = this.#db(Keymap.table)
          .insert({
            keycode: data.keycode,
            type: data.type,
            keyId: data.keyId,
            layerId: data.layerId,
          })
          .returning("*");
      } else {
        throw new DatabaseError(
          "Failed to create keymap",
          query!,
          error as Error,
        );
      }
    }
    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to create keymap", query, error as Error);
    }

    return new Keymap(result);
  }

  async getById(id: number): Promise<Keymap> {
    const query = this.#db<Keymap>(Keymap.table).where({ id }).first();
    const row = await query;

    if (row) return new Keymap(row);

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
    layerId: number,
    keyId: number,
    type: KeymapType,
  ): Promise<Keymap> {
    let row: any;
    let query: Knex.QueryBuilder;
    try {
      query = this.#db(Keymap.table)
        .where({
          layerId,
          keyId,
          type,
        })
        .first();

      row = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get keymaps", query!, error as Error);
    }

    if (row) return new Keymap(row);

    throw new NotFoundError(query!);
  }

  async getKeymapAtCoordinates(
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
  }

  async getKeyboardKeymaps(keyboardId: number): Promise<Map<number, Keymap[]>> {
    const query = this.#db(Keymap.table)
      .column([
        { id: "keymaps.id" },
        "keycode",
        "type",
        "layerId",
        "keyId",
        { "layers.id": "layers.id" },
        { "layers.index": "layers.index" },
        { "layers.keyboardId": "layers.keyboardId" },
        { "keys.column": "keys.column" },
        { "keys.row": "keys.row" },
        { "keys.keyboardId": "keys.keyboardId" },
      ])
      .select()
      .join(Layer.table, "layerId", "=", "layers.id")
      .join(Key.table, "keyId", "=", "keys.id")
      .where("layers.keyboardId", keyboardId)
      .orderBy(["layers.index", "keys.row", "keys.column"]);

    try {
      const rows = await query;

      return this.groupKeymapsByLayer(rows.map((row) => new Keymap(row)));
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

  async deleteKeymapsOfLayer(layerId: number): Promise<void> {
    const query = this.#db(Keymap.table).where("layerId", layerId).del();
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

  private groupKeymapsByLayer(keymaps: Keymap[]): Map<number, Keymap[]> {
    const layerMap = new Map<number, Keymap[]>();

    for (const keymap of keymaps) {
      if (keymap.layer) {
        const layer = layerMap.get(keymap.layer.index);
        if (!layer) {
          layerMap.set(keymap.layer.index, [keymap]);
        } else {
          layer.push(keymap);
          layerMap.set(keymap.layer.index, layer);
        }
      }
    }

    return layerMap;
  }
}
