import fs from "fs/promises";
import LayerRepo from "../service/layerRepo";

/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  const contents = await fs.readFile(
    process.cwd() + "/data/layers.json",
    "utf8",
  );
  const data = JSON.parse(contents);
  const layerRepo = new LayerRepo(knex);

  for (const layerIndex in data) {
    console.log("LAYER: " + layerIndex.toString());
    const layerData = data[layerIndex];
    await layerRepo.deleteLayer(layerIndex);
    await layerRepo.createLayer(layerData, layerIndex);
  }

  for (const layerIndex in data) {
    const layerData = await layerRepo.getLayer(layerIndex);
    console.log("LAYER: ", layerData);
    console.log(layerData);
  }
}