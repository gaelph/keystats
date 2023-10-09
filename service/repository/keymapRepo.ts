import type { Knex } from "knex";
import Keymap, { KeymapOptions, KeymapType } from "../models/keymap.js";

import Repository from "./Repository.js";
import { DatabaseRecordNotFoundError } from "../database.js";
import Key from "../models/key.js";
import Layer from "../models/layer.js";

export default class KeymapRepository implements Repository<Keymap> {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  build(data: KeymapOptions): Keymap {
    return new Keymap(data);
  }

  async create(data: Keymap): Promise<Keymap> {
    const [id] = await this.#db(Keymap.table).insert(data).returning("id");
    if (!id) {
      throw new Error("Failed to create keymap");
    }

    data.id = id;
    return data;
  }

  async createKeymap(
    keyboardId: number,
    layerId: number,
    column: number,
    row: number,
    keycode: string,
  ): Promise<Keymap> {
    const key = await this.#db(Key.table)
      .where({
        keyboardId,
        column,
        row,
      })
      .first();
    if (!key) {
      throw new DatabaseRecordNotFoundError(Key);
    }

    const layer = await this.#db(Layer.table)
      .where({
        keyboardId,
        index: layerId,
      })
      .first();

    const plainCode = (parseInt(keycode, 16) & 0xff).toString(16);

    const keymap = this.build({
      keycode: plainCode,
      type: KeymapType.Plain,
      layerId: layer.id,
      keyId: key.id,
    });
    return await this.create(keymap);
  }

  async getById(id: number): Promise<Keymap> {
    const row = await this.#db(Keymap.table).where({ id }).first();

    return new Keymap(row);
  }

  async getAll(): Promise<Keymap[]> {
    const rows = await this.#db(Keymap.table).select();

    return rows.map((row) => new Keymap(row));
  }

  async update(data: Keymap): Promise<Keymap> {
    if (!data.id) {
      throw new Error("Keymap id is required");
    }

    const exists = await this.getById(data.id);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(Keymap);
    }

    await this.#db(Keymap.table)
      .where({ id: data.id })
      .update({ keycode: data.keycode });

    return data;
  }

  async delete(id: number): Promise<void> {
    const exists = await this.getById(id);
    if (!exists) {
      throw new DatabaseRecordNotFoundError(Keymap);
    }

    await this.#db(Keymap.table).where({ id: id }).del();
  }
}
