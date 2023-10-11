import log from "loglevel";
import Keymap, { KeymapType } from "./models/keymap.js";
import KeymapRepo from "./repository/keymapRepo.js";
import KeysRepo from "./repository/keysRepo.js";

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
    layerId: number,
    column: number,
    row: number,
    keycode: string,
    type: KeymapType,
  ): Promise<Keymap | null> {
    try {
      const key = await this.#keysRepo.getAtCoordinates(
        keyboardId,
        column,
        row,
      );

      const keymap = this.#keymapRepo.build({
        keycode: keycode,
        type: type,
        layerId: layerId,
        keyId: key.id!,
      });

      return await this.#keymapRepo.create(keymap);
    } catch (error) {
      this.#logger.error(error);
    }

    return null;
  }
}
