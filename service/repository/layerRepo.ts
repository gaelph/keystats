import Key from "../models/key.js";
import Layer, { LayerOptions } from "../models/layer.js";
import Keymap, { KeymapType } from "../models/keymap.js";
import { DatabaseError, DatabaseRecordNotFoundError } from "../database.js";
import type { Knex } from "knex";

import * as Keycodes from "../../lib/keycodes.js";

import Repository from "./Repository.js";

function parallelMap<T, R>(
  arr: T[],
  fn: (_item: T, _index: number) => Promise<R>,
): Promise<R[]> {
  return Promise.all(arr.map(fn));
}

export default class LayerRepo implements Repository<Layer> {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  build(data: LayerOptions): Layer {
    return new Layer(data);
  }

  async getKey(column: number, row: number): Promise<Key> {
    const data = await this.#db
      .select("*")
      .from(Key.table)
      .where({ column, row })
      .first();

    if (data) {
      return new Key(data);
    }

    throw new DatabaseRecordNotFoundError(Key);
  }

  async create(layer: Layer): Promise<Layer> {
    const { keyboardId, index } = layer;

    const existing = await this.getLayer(keyboardId, index);
    if (existing) {
      return new Layer(existing);
    }

    const [inserted] = await this.#db(Layer.table)
      .insert([{ keyboardId, index }])
      .returning("*");

    if (inserted) {
      return new Layer(inserted);
    }

    throw new DatabaseError("Could not create layer", null);
  }

  async getById(id: number): Promise<Layer> {
    const row = await this.#db(Layer.table).where({ id }).first();
    if (!row) {
      throw new DatabaseRecordNotFoundError(Layer);
    }

    return new Layer(row);
  }

  async getAll(): Promise<Layer[]> {
    const rows = await this.#db(Layer.table).select("*");

    return rows.map((row) => new Layer(row));
  }

  async getLayer(keyboardId: number, index: number): Promise<Layer> {
    return await this.#db(Layer.table).where({ keyboardId, index }).first();
  }

  async update(layer: Layer): Promise<Layer> {
    const { id, keyboardId, index } = layer;
    if (!id) {
      throw new Error("Layer id is required");
    }

    const existing = await this.getById(id);
    if (!existing) {
      throw new DatabaseRecordNotFoundError(Layer);
    }

    await this.#db(Layer.table).where({ id }).update({ keyboardId, index });

    return layer;
  }

  async createKeymap(
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

  // TODO: move to a service
  async createLayerMapping(
    layerIndex: number,
    layerMapping: string[][],
  ): Promise<Keymap[]> {
    const layer = await this.#db
      .select("id")
      .from(Layer.table)
      .where("index", layerIndex)
      .first();

    const keymaps = (
      await parallelMap(
        layerMapping,
        async (row, rowIndex) =>
          await parallelMap(row, async (keycode, colIndex) => {
            console.log(
              "keycode: " +
                keycode +
                " colIndex: " +
                colIndex +
                " rowIndex: " +
                rowIndex,
            );
            const [base, type, alter] = Keycodes.getEncodedKeycode(keycode);
            console.log(
              "base: " + base + " type: " + type + " alter: " + alter,
            );

            const key = await this.getKey(colIndex, rowIndex);
            const plains = await this.createKeymap(
              layer,
              key,
              base,
              KeymapType.Plain,
            );
            let alters: Keymap[] = [];

            if (type !== KeymapType.Plain) {
              alters = await this.createKeymap(layer, key, alter, type);
            }

            return [...plains, ...alters];
          }),
      )
    ).flat(10);

    return keymaps.map((keymap) => new Keymap(keymap));
  }

  async delete(layerId: number): Promise<void> {
    try {
      await this.#db.delete().from(Keymap.table).where("layerId", layerId);
      await this.#db.delete().from(Layer.table).where("id", layerId);
    } catch (err: unknown) {
      throw new DatabaseError(`Deleting layer ${layerId} failed`, err as Error);
    }
  }

  // TODO: move to a service
  async updateLayerMapping(
    layerId: number,
    mappingData: string[][],
  ): Promise<Keymap[]> {
    const keymaps = (
      await parallelMap(
        mappingData,
        async (row, rowIndex) =>
          await parallelMap(row, async (keycode, colIndex) => {
            const key = await this.getKey(colIndex, rowIndex);

            return {
              layerId: layerId,
              keyId: key.id,
              keycode,
            };
          }),
      )
    ).flat();

    const updated = await this.#db(Keymap.table)
      .where("layerId", layerId)
      .update(keymaps, ["id", "layerId", "keyId", "keycode"]);

    return updated.map((keymap) => new Keymap(keymap));
  }

  // TODO: move to the keymap repository
  async getKeyboardKeymaps(keyboardId: number): Promise<Map<number, Keymap[]>> {
    const rows = await this.#db(Keymap.table)
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

    const layerMap = new Map<number, Keymap[]>();

    for (const row of rows) {
      const keymap = new Keymap(row);

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

  async getLayerKeymap(
    keyboardId: number,
    layerIndex: number,
  ): Promise<string[][]> {
    const layerData: {
      keycode: string;
      column: number;
      row: number;
    }[] = await this.#db
      .column(["keycode", { column: "keys.column" }, { row: "keys.row" }])
      .select()
      .from(Keymap.table)
      .join(Key.table, "keyId", "=", "keys.id")
      .join(Layer.table, "layerId", "=", "layers.id")
      .where({ "layers.index": layerIndex, "layers.keyboardId": keyboardId })
      .orderBy(["keys.row", "keys.column"]);

    const layer: string[][] = [[]];

    layerData.forEach(({ keycode, column, row }) => {
      if (!layer[row]) {
        layer[row] = [];
      }
      layer[row][column] = keycode;
    });

    return layer;
  }
}
