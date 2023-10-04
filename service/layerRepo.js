const LAYERS = "layers";
const KEYS = "keys";
const KEYMAPS = "keymaps";

function parallelMap(arr, fn) {
  return Promise.all(arr.map(fn));
}

function newMapping(layer, key, keycode) {
  return {
    layerId: layer.id,
    keyId: key.id,
    keycode,
  };
}

export default class LayerRepo {
  #db;
  constructor(db) {
    this.#db = db;
  }

  async getKey(column, row) {
    return await this.#db.select("*").from(KEYS).where({ column, row }).first();
  }

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

  async deleteLayer(layerIndex) {
    await this.#db.delete().from(KEYMAPS).where("layerId", layerIndex);
  }

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

  async getLayer(layerIndex) {
    const layerData = await this.#db
      .column(["keycode", { column: "keys.column" }, { row: "keys.row" }])
      .select()
      .from(KEYMAPS)
      .join(KEYS, "keyId", "=", "keys.id")
      .where("layerId", layerIndex)
      .orderBy("keys.row", "asc", "keys.column", "asc");

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
