import log from "loglevel";
import FingerUsage from "./models/fingerUsage.js";
import FingerUsageRepo from "./repository/fingerUsageRepo.js";
import KeysRepo from "./repository/keysRepo.js";

const LPKY = 0;
const LRNG = 1;
const LMID = 2;
const LIND = 3;
const LTHB = 4;
const RTHB = 5;
const RIND = 6;
const RMID = 7;
const RRNG = 8;
const RPKY = 9;

export default class FingerService {
  #fingerUsageRepo: FingerUsageRepo;
  #keysRepo: KeysRepo;
  currentCount: [
    number, // LPKY
    number, // LRNG
    number, // LMID
    number, // LIND
    number, // LTHB
    number, // RTHB
    number, // RIND
    number, // RMID
    number, // RRNG
    number, // RPKY
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  currentFinger: number = -1;

  #logger = log.getLogger("FingerService");

  constructor(fingerUsageRepo: FingerUsageRepo, keysRepo: KeysRepo) {
    this.#fingerUsageRepo = fingerUsageRepo;
    this.#keysRepo = keysRepo;
  }

  async getLatest(keyboardId: number): Promise<FingerUsage | null> {
    try {
      return await this.#fingerUsageRepo.getLatest(keyboardId);
    } catch (err: unknown) {
      this.#logger.error(err);
      return null;
    }
  }

  async incrementFingerUsage(
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

    this.currentCount[key.finger] = this.currentCount[key.finger] + 1;

    // If we changed fingers, increment the finger usage for the previously
    // used finger, my the amount stored in the current count
    if (this.currentFinger === -1) {
      await this.#fingerUsageRepo.incrementFingerUsage(
        keyboardId,
        key.finger,
        1,
      );
      this.currentFinger = key.finger;
      return;
    }

    this.#logger.debug("current fingers count: ", this.currentCount);

    if (this.currentFinger !== key.finger) {
      const otherFinger = this.currentFinger;
      this.currentFinger = key.finger;
      const otherCount = this.currentCount[otherFinger];

      if (otherCount > 0) {
        this.#logger.debug(
          "incrementing finger usage for " +
            otherFinger +
            " of " +
            otherCount +
            "repeats",
        );

        await this.#fingerUsageRepo.incrementFingerUsage(
          keyboardId,
          otherFinger,
          otherCount,
        );
        this.currentCount[otherFinger] = 0;
      }
    }
  }

  async getFingerUsage(keyboardId: number): Promise<FingerCount> {
    const data = await this.#fingerUsageRepo.getForKeyboard(keyboardId);
    const result: FingerCount = [[], [], [], [], [], [], [], [], [], []];

    for (const datum of data) {
      const { finger, repeats, count } = datum;
      if (!result[finger][repeats]) {
        result[finger][repeats] = 0;
      }
      result[finger][repeats] += count;
    }

    return result;
  }
}

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
