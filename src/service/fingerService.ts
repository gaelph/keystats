import log from "../lib/logger.js";
import FingerUsageRepo from "./repository/fingerUsageRepo.js";
import KeysRepo from "./repository/keysRepo.js";
import Key from "./models/key.js";
import { FilterOptions } from "./types.js";

type FingerCount = [
  number[],
  number[],
  number[],
  number[],
  number[],
  number[],
  number[],
  number[],
  number[],
  number[],
];

type CurrentCount = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export default class FingerService {
  #fingerUsageRepo: FingerUsageRepo;
  #keysRepo: KeysRepo;
  #timeout?: NodeJS.Timeout = undefined;
  currentCount: CurrentCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  currentFinger: number = -1;

  #logger = log.getLogger("FingerService");

  constructor() {
    this.#fingerUsageRepo = new FingerUsageRepo();
    this.#keysRepo = new KeysRepo();
  }

  async saveCount(keyboardId: number): Promise<void> {
    for (const finger in this.currentCount) {
      const count = this.currentCount[finger];

      if (count > 0) {
        this.#logger.debug(
          "incrementing finger usage for " +
            finger +
            " of " +
            count +
            "repeats",
        );

        await this.#fingerUsageRepo.incrementFingerUsage(
          keyboardId,
          parseInt(finger, 10),
          count,
        );
      }
    }

    this.currentCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  async incrementFingerUsage(
    keyboardId: number,
    column: number,
    row: number,
  ): Promise<void> {
    let key: Key;

    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
    const self = this;

    try {
      key = await this.#keysRepo.getAtCoordinates(keyboardId, column, row);
    } catch (err: unknown) {
      this.#logger.error(err);
      return;
    }

    // If we change finger save the current count and reset
    if (this.currentFinger >= 0 && this.currentFinger !== key.finger) {
      await self.saveCount(keyboardId);
    }
    this.currentFinger = key.finger;

    this.currentCount[this.currentFinger] =
      this.currentCount[this.currentFinger] + 1;

    // Save the counts after 1 second
    setTimeout(() => {
      self.saveCount(keyboardId);
    }, 200);
  }

  async getFingerUsage(
    keyboardId: number,
    filters: FilterOptions = {},
  ): Promise<FingerCount | null> {
    try {
      const data = await this.#fingerUsageRepo.getForKeyboard(
        keyboardId,
        filters,
      );
      const result: FingerCount = [[], [], [], [], [], [], [], [], [], []];

      for (const datum of data) {
        const { finger, repeats, count } = datum;
        if (!result[finger][repeats]) {
          result[finger][repeats] = 0;
        }
        result[finger][repeats] += count;
      }

      return result;
    } catch (err: unknown) {
      this.#logger.error(err);
      return null;
    }
  }
}
