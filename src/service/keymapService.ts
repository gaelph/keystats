import log from "../lib/logger.js";
import Keymap, { KeymapType } from "./models/keymap.js";
import KeymapRepo from "./repository/keymapRepo.js";
import KeysRepo from "./repository/keysRepo.js";

import * as Keycodes from "../lib/keycodes.js";
import Keyboard from "./models/keyboard.js";
import { Coordinates } from "./types.js";

export default class KeymapService {
  #keymapRepo: KeymapRepo;
  #keysRepo: KeysRepo;

  #logger = log.getLogger("KeymapService");

  constructor() {
    this.#keymapRepo = new KeymapRepo();
    this.#keysRepo = new KeysRepo();
  }

  async createKeymap(
    keyboardId: number,
    layer: number,
    column: number,
    row: number,
    keycode: string,
    type: KeymapType,
  ): Promise<Keymap | null> {
    try {
      const keymap = this.#keymapRepo.build({
        keyboardId: keyboardId,
        keycode: keycode,
        type: type,
        layer: layer,
        column: column,
        row: row,
      });

      return await this.#keymapRepo.create(keymap);
    } catch (error) {
      this.#logger.error(error);
    }

    return null;
  }

  async createLayerMapping(
    keyboardId: number,
    layer: number,
    keycodes: string[][],
  ): Promise<Keymap[]> {
    const km = keycodes
      .map((row, rowIndex) =>
        row.map((keycode, colIndex) => {
          const [base, type, alter] = Keycodes.getEncodedKeycode(keycode);
          const result: Keymap[] = [];

          if (base !== "") {
            result.push(
              this.#keymapRepo.build({
                keyboardId: keyboardId,
                keycode: base,
                type: KeymapType.Plain,
                layer: layer,
                column: colIndex,
                row: rowIndex,
              }),
            );
          }

          if (type !== KeymapType.Plain) {
            result.push(
              this.#keymapRepo.build({
                keyboardId: keyboardId,
                keycode: alter,
                type: type,
                layer: layer,
                column: colIndex,
                row: rowIndex,
              }),
            );
          }

          return result;
        }),
      )
      .flat(2);

    const keymaps = await Promise.all(
      km.map((keymap: Keymap) => {
        return this.#keymapRepo.create(keymap);
      }),
    );

    return keymaps;
  }

  async getKeyboardKeymaps(
    keyboard: Keyboard,
  ): Promise<Map<number, Keymap[]> | null> {
    try {
      const keymaps = await this.#keymapRepo.getByKeyboard(keyboard.id!);
      return this.groupKeymapsByLayer(keymaps);
    } catch (error) {
      this.#logger.error(error);
      return null;
    }
  }

  private groupKeymapsByLayer(keymaps: Keymap[]): Map<number, Keymap[]> {
    const layerMap = new Map<number, Keymap[]>();

    for (const keymap of keymaps) {
      const layer = layerMap.get(keymap.layer);
      if (!layer) {
        layerMap.set(keymap.layer, [keymap]);
      } else {
        layer.push(keymap);
        layerMap.set(keymap.layer, layer);
      }
    }

    return layerMap;
  }

  async getKeymap(
    keyboardId: number,
    coordinates: Coordinates,
    keycode: string,
    type: KeymapType,
  ): Promise<Keymap | null> {
    try {
      const keymap = await this.#keymapRepo.getOne(
        keyboardId,
        coordinates,
        type,
        keycode,
      );
      return keymap;
    } catch (error) {
      return null;
    }
  }
}
