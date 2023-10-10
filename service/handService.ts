import log from "loglevel";
import HandUsage from "./models/handUsage.js";
import HandUsageRepo from "./repository/handUsagerRepo.js";
import KeysRepo from "./repository/keysRepo.js";

const LEFT = 0;
const RIGHT = 1;

export default class HandService {
  #handUsageRepo: HandUsageRepo;
  #keysRepo: KeysRepo;
  currentCount: [number, number] = [0, 0];
  currentHand: number = 1;

  #logger = log.getLogger("HandService");

  constructor(handUsageRepo: HandUsageRepo, keysRepo: KeysRepo) {
    this.#handUsageRepo = handUsageRepo;
    this.#keysRepo = keysRepo;
  }

  async getLatest(keyboardId: number): Promise<HandUsage | null> {
    try {
      return await this.#handUsageRepo.getLatest(keyboardId);
    } catch (err: unknown) {
      this.#logger.error(err);
      return null;
    }
  }

  async incrementHandUsage(
    keyboardId: number,
    column: number,
    row: number,
  ): Promise<void> {
    const key = await this.#keysRepo.getAtCoordinates(keyboardId, column, row);
    if (!key) {
      this.#logger.warn(
        `Could not find key at column ${column} and row ${row}`,
      );
      return;
    }

    this.currentCount[key.hand] += 1;

    // If we changed hands, increment the hand usage for the previously
    // used hand, my the amount stored in the current count
    if (this.currentHand === -1) {
      await this.#handUsageRepo.incrementHandUsage(keyboardId, key.hand, 1);
      this.currentHand = key.hand;
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

        await this.#handUsageRepo.incrementHandUsage(
          keyboardId,
          otherHand,
          otherCount,
        );
        this.currentCount[otherHand] = 0;
      }
    }
  }

  async getHandUsage(keyboardId: number): Promise<[number[], number[]]> {
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
  }
}
