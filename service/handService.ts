import log from "loglevel";
import HandUsageRepo from "./repository/handUsagerRepo.js";
import KeysRepo from "./repository/keysRepo.js";
import Key from "./models/key.js";

const LEFT = 0;
const RIGHT = 1;

export default class HandService {
  #handUsageRepo: HandUsageRepo;
  #keysRepo: KeysRepo;
  currentCount: [number, number] = [0, 0];
  currentHand: number = 1;

  #logger = log.getLogger("HandService");

  constructor() {
    this.#handUsageRepo = new HandUsageRepo();
    this.#keysRepo = new KeysRepo();
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

    this.currentCount[key.hand] += 1;

    // If we changed hands, increment the hand usage for the previously
    // used hand, my the amount stored in the current count
    if (this.currentHand === -1) {
      try {
        await this.#handUsageRepo.incrementHandUsage(keyboardId, key.hand, 1);
        this.currentHand = key.hand;
      } catch (error: unknown) {
        this.#logger.error(error);
      }
      return;
    }

    this.#logger.debug("current left count: " + this.currentCount[LEFT]);
    this.#logger.debug("current right count: " + this.currentCount[RIGHT]);

    if (this.currentHand !== key.hand) {
      const otherHand = this.currentHand;
      this.currentHand = key.hand;
      const otherCount = this.currentCount[otherHand];

      if (otherCount > 0) {
        this.#logger.debug(
          "incrementing hand usage for " +
            otherHand +
            " of " +
            otherCount +
            "repeats",
        );

        try {
          await this.#handUsageRepo.incrementHandUsage(
            keyboardId,
            otherHand,
            otherCount,
          );
          this.currentCount[otherHand] = 0;
        } catch (error: unknown) {
          this.#logger.error(error);
        }
      }
    }
  }

  async getHandUsage(keyboardId: number): Promise<[number[], number[]] | null> {
    try {
      const data = await this.#handUsageRepo.getForKeyboard(keyboardId);
      const result: [number[], number[]] = [[], []];

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
