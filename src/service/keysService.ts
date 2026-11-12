import log from "../lib/logger";
import Key, { KeyOptions } from "./models/key.js";
import KeysRepo from "./repository/keysRepo.js";

export default class KeysService {
  #keysRepo: KeysRepo;

  #logger = log.getLogger("KeysService");

  constructor() {
    this.#keysRepo = new KeysRepo();
  }

  /**
   * Create a new key
   * @param key Key options
   * @returns Promise<Key | null>
   */
  async create(key: KeyOptions): Promise<Key | null> {
    try {
      return await this.#keysRepo.create(this.#keysRepo.build(key));
    } catch (error) {
      this.#logger.error(error);
      return null;
    }
  }

  /**
   * Create keys with layout
   * @param {number} keyboardId Keyboard ID
   * @param {number[][]} layout Layout
   * @returns Promise<Key[]>
   */
  async createKeysWithLayout(
    keyboardId: number,
    layout: number[][],
  ): Promise<Key[]> {
    const keys = await Promise.all(
      layout
        .flatMap((rowData, row) => {
          return rowData.map((finger, column) => {
            const hand = finger < 5 ? 0 : 1;
            return {
              column,
              row,
              finger,
              hand,
              keyboardId,
            };
          });
        })
        .map((value) => this.create(value)),
    );

    return keys.filter((keys) => keys !== null) as Key[];
  }
}
