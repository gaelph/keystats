import Key from "../models/key.js";
import Layer, { LayerOptions } from "../models/layer.js";
import Keymap, { KeymapType } from "../models/keymap.js";
import db, { DatabaseError, NotFoundError } from "../database.js";
import type { Knex } from "knex";

import Repository from "./Repository.js";
import KeysRepo from "./keysRepo.js";
import KeymapRepo from "./keymapRepo.js";

export default class LayerRepo implements Repository<Layer> {
  #db: Knex;
  #keyRepo: KeysRepo;
  #keymapRepo: KeymapRepo;

  constructor() {
    this.#db = db;
    this.#keyRepo = new KeysRepo();
    this.#keymapRepo = new KeymapRepo();
  }

  build(data: LayerOptions): Layer {
    return new Layer(data);
  }

  async create(layer: Layer): Promise<Layer> {
    let result: any;
    let query: Knex.QueryBuilder;

    try {
      const exists = await this.getLayer(layer.keyboardId, layer.index);

      query = this.#db(Layer.table)
        .update({ index: layer.index })
        .where({ id: exists.id })
        .returning("*");
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        query = this.#db(Layer.table)
          .insert({ keyboardId: layer.keyboardId, index: layer.index })
          .returning("*");
      } else {
        throw new DatabaseError(
          "Failed to create layer",
          query!,
          error as Error,
        );
      }
    }

    try {
      [result] = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to create layer", query!, error as Error);
    }

    return new Layer(result);
  }

  async getById(id: number): Promise<Layer> {
    let row: any;
    const query = this.#db(Layer.table).where({ id }).first();

    try {
      row = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get layer", query, error as Error);
    }

    if (!row) {
      throw new NotFoundError(query);
    }

    return new Layer(row);
  }

  async getAll(): Promise<Layer[]> {
    throw new Error("Method not implemented.");
  }

  async getLayer(keyboardId: number, index: number): Promise<Layer> {
    let row: any;
    const query = this.#db<Layer>(Layer.table)
      .where({ keyboardId, index })
      .first();

    try {
      row = await query;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to get layer", query, error as Error);
    }

    if (row) return new Layer(row);

    throw new NotFoundError(query);
  }

  async update(layer: Layer): Promise<Layer> {
    const { id, keyboardId, index } = layer;
    await this.getById(id!);

    let row: any;
    const query = this.#db(Layer.table)
      .where({ id })
      .update({ keyboardId, index })
      .returning("*");

    try {
      [row] = await query;
      return new Layer(row);
    } catch (error: unknown) {
      throw new DatabaseError("Failed to update layer", query, error as Error);
    }
  }

  private async createKeymap(
    layer: Layer,
    key: Key,
    base: string,
    type: KeymapType,
  ): Promise<Keymap[]> {
    const existing = await this.#db(Keymap.table)
      .select("id")
      .where({ layerId: layer.id, keyId: key.id, type: type })
      .first();

    if (existing) {
      return (await this.#db(Keymap.table)
        .where({ id: existing.id })
        .update({ keycode: base, type: type })
        .returning("*")) as Keymap[];
    }

    return (await this.#db(Keymap.table)
      .insert({
        layerId: layer.id,
        keyId: key.id,
        keycode: base,
        type: type,
      })
      .returning("*")) as Keymap[];
  }

  async delete(layerId: number): Promise<void> {
    const query = this.#db(Layer.table).where({ id: layerId }).del();
    try {
      await query;
    } catch (err: unknown) {
      throw new DatabaseError("Failed to delete layer", query, err as Error);
    }
  }
}
