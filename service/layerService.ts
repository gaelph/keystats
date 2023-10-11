import Keymap, { KeymapType } from "./models/keymap.js";
import LayerRepo from "./repository/layerRepo.js";
import KeymapRepo from "./repository/keymapRepo.js";

import * as Keycodes from "../lib/keycodes.js";
import KeymapService from "./keymapService.js";

function parallelMap<T, R>(
  arr: T[],
  fn: (_item: T, _index: number) => Promise<R>,
): Promise<R[]> {
  return Promise.all(arr.map(fn));
}

export default class LayerService {
  #layerRepo: LayerRepo;
  #keymapRepo: KeymapRepo;
  #keymapService: KeymapService;

  constructor() {
    this.#layerRepo = new LayerRepo();
    this.#keymapRepo = new KeymapRepo();
    this.#keymapService = new KeymapService();
  }

  async createLayerMapping(
    keyboardId: number,
    layerIndex: number,
    layerMapping: string[][],
  ): Promise<Keymap[]> {
    const layer = await this.#layerRepo.getLayer(keyboardId, layerIndex);

    const keymaps = (
      await parallelMap(
        layerMapping,
        async (row, rowIndex) =>
          await parallelMap(row, async (keycode, colIndex) => {
            const [base, type, alter] = Keycodes.getEncodedKeycode(keycode);

            const plainKeymap = await this.#keymapService.createKeymap(
              keyboardId,
              layer.id!,
              colIndex,
              rowIndex,
              base,
              KeymapType.Plain,
            );

            if (type !== KeymapType.Plain) {
              const modKeymap = await this.#keymapService.createKeymap(
                keyboardId,
                layer.id!,
                colIndex,
                rowIndex,
                alter,
                type,
              );

              return [plainKeymap, modKeymap];
            }

            return [plainKeymap];
          }),
      )
    )
      .flat(10)
      // expunge empty keymaps
      .filter((keymap) => !!keymap) as Keymap[];

    return keymaps;
  }
}
