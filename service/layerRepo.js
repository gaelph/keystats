// @ts-check

import Key from "./models/key";

const LAYERS = "layers";
const KEYS = "keys";
const KEYMAPS = "keymaps";

/**
 * @template T
 * @template R
 * @param {T[]} arr
 * @param {(item: T, index: number) => Promise<R>} fn
 * @returns {Promise<R[]>}
 */
function parallelMap(arr, fn) {
  return Promise.all(arr.map(fn));
}

/**
 * @param {import("./models/layer").default} layer
 * @param {import("./models/key").default} key
 * @param {number} keycode
 * @returns {{ layerId: number, keyId: number, keycode: number }}
 */
function newMapping(layer, key, keycode) {
  return {
    layerId: layer.id,
    keyId: key.id,
    keycode,
  };
}

export default class LayerRepo {
  /** @type {import("knex").Knex} */
  #db;

  /**
   * @param {import("knex").Knex} db
   */
  constructor(db) {
    this.#db = db;
  }

  /**
   * @param {number} column
   * @param {number} row
   * @returns {Promise<Key>}
   */
  async getKey(column, row) {
    const data = await this.#db
      .select("*")
      .from(KEYS)
      .where({ column, row })
      .first();
    return new Key(data);
  }

  /**
   * @param {string[][]} layerData
   * @param {number} layerIndex
   * @returns {Promise<number[][]>} keymaps ids
   */
  async createLayer(layerData, layerIndex) {
    const layer = await this.#db
      .select("id")
      .from(LAYERS)
      .where("id", layerIndex)
      .first();

    return (
      await parallelMap(
        layerData,
        async (row, rowIndex) =>
          await parallelMap(row, async (keycode, colIndex) => {
            const key = await this.getKey(colIndex, rowIndex);
            const keymapping = newMapping(layer, key, keycode);

            return this.#db(KEYMAPS).insert(keymapping);
          }),
      )
    ).flat();
  }

  /**
   * @param {number} layerIndex
   * @returns {Promise<any>}
   */
  async deleteLayer(layerIndex) {
    await this.#db.delete().from(KEYMAPS).where("layerId", layerIndex);
  }

  /**
   * @param {number} layerId
   * @param {string[][]} layerData
   * @returns {Promise<number[][]>} keymaps ids
   */
  async updateLayer(layerId, layerData) {
    return (
      await parallelMap(
        layerData,
        async (row, rowIndex) =>
          await parallelMap(row, async (keycode, colIndex) => {
            const key = await this.getKey(colIndex, rowIndex);

            return this.#db(KEYMAPS)
              .where({ layerId: layerId, keyId: key.id })
              .upsert("keycode", keycode);
          }),
      )
    ).flat();
  }

  /**
   * @param {number} layerIndex
   * @returns {Promise<number[][]>}
   */
  async getLayer(layerIndex) {
    /** @type {{ keycode: number, column: number, row: number }[]} */
    const layerData = await this.#db
      .column(["keycode", { column: "keys.column" }, { row: "keys.row" }])
      .select()
      .from(KEYMAPS)
      .join(KEYS, "keyId", "=", "keys.id")
      .where("layerId", layerIndex)
      .orderBy("keys.row", "asc", "keys.column", "asc");

    /** @type {number[][]} */
    const layer = [[]];

    layerData.forEach(({ keycode, column, row }) => {
      if (!layer[row]) {
        layer[row] = [];
      }
      layer[row][column] = keycode;
    });

    return layer;
  }
}
