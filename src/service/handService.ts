import log from "../lib/logger.js";
import HandUsageRepo from "./repository/handUsagerRepo.js";
import KeysRepo from "./repository/keysRepo.js";
import Key from "./models/key.js";
import { FilterOptions } from "./types.js";

const LEFT = 0;
const RIGHT = 1;

type HandCount = [number[], number[]];
type CurrentCount = [number, number];

export default class HandService {
  #handUsageRepo: HandUsageRepo;
  #keysRepo: KeysRepo;
  #timeout?: NodeJS.Timeout;
  currentCount: CurrentCount = [0, 0];
  currentHand: number = 1;

  #logger = log.getLogger("HandService");

  constructor() {
    this.#handUsageRepo = new HandUsageRepo();
    this.#keysRepo = new KeysRepo();
  }

  async saveCount(keyboardId: number): Promise<void> {
    for (const hand in this.currentCount) {
      const count = this.currentCount[hand];

      if (count > 1) {
        this.#logger.debug(
          "incrementing hand usage for " + hand + " of " + count + "repeats",
        );

        await this.#handUsageRepo.incrementHandUsage(
          keyboardId,
          parseInt(hand, 10),
          count,
        );
      }
    }

    this.currentCount = [0, 0];
  }

  async incrementHandUsage(
    keyboardId: number,
    column: number,
    row: number,
  ): Promise<void> {
    let key: Key;
    try {
      key = await this.#keysRepo.getAtCoordinates(keyboardId, column, row);
    } catch (error: unknown) {
      this.#logger.error(error);
      return;
    }

    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }

    const self = this;

    // If we change hande save the current count and reset
    if (this.currentHand >= 0 && this.currentHand !== key.hand) {
      await self.saveCount(keyboardId);
    }
    this.currentHand = key.hand;

    this.currentCount[this.currentHand] += 1;

    // Save the counts afer 1 second has elapsed
    setTimeout(() => {
      self.saveCount(keyboardId);
    }, 1000);
  }

  async getHandUsage(
    keyboardId: number,
    filters: FilterOptions = {},
  ): Promise<HandCount | null> {
    try {
      const data = await this.#handUsageRepo.getForKeyboard(
        keyboardId,
        filters,
      );
      const result: HandCount = [[], []];

      for (const datum of data) {
        const { hand, repeats, count } = datum;
        if (!result[hand][repeats]) {
          result[hand][repeats] = 0;
        }
        result[hand][repeats] += count;
      }

      return result;
    } catch (error: unknown) {
      this.#logger.error(error);
      return null;
    }
  }
}
