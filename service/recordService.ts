import KeymapService from "./keymapService.js";
import { KeymapType } from "./models/keymap.js";
import Record from "./models/record.js";
import RecordRepo, { RecordCount } from "./repository/recordRepo.js";
import { Coordinates, FilterOptions } from "./types.js";

export default class RecordService {
  #recordRepo: RecordRepo;
  #keymapService: KeymapService;

  constructor(keymapService?: KeymapService) {
    this.#recordRepo = new RecordRepo();
    this.#keymapService = keymapService || new KeymapService();
  }

  async addRecord(
    keyboardId: number,
    coordinates: Coordinates,
    keycode: string,
    modifiers: number,
    type: KeymapType,
  ): Promise<Record | null> {
    try {
      // FIXME: There should be a better way to do this.
      const keymap = await this.#keymapService.getKeymap(
        keyboardId,
        coordinates,
        keycode,
        type,
      );

      if (!keymap) {
        return null;
      }

      return this.#recordRepo.addRecord(keymap, {
        type,
        modifiers,
        row: coordinates.row,
        column: coordinates.column,
        counts: 1,
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async getRecords(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<Record[][][][]> {
    const records = await this.#recordRepo.getRecords(keyboardId, filter);
    const groupedRecords: Record[][][][] = [];

    for (const record of records) {
      const row = record.keymap!.row;
      const column = record.keymap!.column;
      const layer = record.keymap!.layer;
      if (!groupedRecords[layer]) {
        groupedRecords[layer] = [];
      }
      if (!groupedRecords[layer][row]) {
        groupedRecords[layer][row] = [];
      }
      if (!groupedRecords[layer][row][column]) {
        groupedRecords[layer][row][column] = [];
      }
      groupedRecords[layer][row][column].push(record);
    }

    return groupedRecords;
  }

  async getKeymapUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<number[][][]> {
    const counts = await this.#recordRepo.getKeymapUsage(keyboardId, filter);
    const groupedCounts: number[][][] = [];

    for (const countRow of counts) {
      const { layer, row, column } = countRow;

      if (!groupedCounts[layer]) {
        groupedCounts[layer] = [];
      }
      if (!groupedCounts[layer][row]) {
        groupedCounts[layer][row] = [];
      }
      if (!groupedCounts[layer][row][column]) {
        groupedCounts[layer][row][column] = 0;
      }
      let count = 0;
      if (typeof countRow.count === "string") {
        count = parseInt(countRow.count);
      } else {
        count = countRow.count;
      }
      groupedCounts[layer][row][column] += count;
    }

    return groupedCounts;
  }

  async getCharacterCount(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<RecordCount[]> {
    const records = await this.#recordRepo.getCharacterCount(
      keyboardId,
      filter,
    );

    return records;
  }

  async getTotalKeypresses(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<number> {
    const total = await this.#recordRepo.getTotalKeypresses(keyboardId, filter);
    return total;
  }

  async getLayerUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<{ [key: number]: number }> {
    const counts = await this.#recordRepo.getLayerUsage(keyboardId, filter);

    const layerUsage: Map<number, number> = new Map();

    for (const count of counts) {
      layerUsage.set(count.layer, count.count);
    }

    return Object.fromEntries(layerUsage);
  }

  async getRowUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<{ [key: number]: number }> {
    const counts = await this.#recordRepo.getRowUsage(keyboardId, filter);
    const rowUsage: Map<number, number> = new Map();

    for (const count of counts) {
      rowUsage.set(count.row, count.count);
    }

    return Object.fromEntries(rowUsage);
  }

  async getHandUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<{ [key: number]: number }> {
    const counts = await this.#recordRepo.getHandUsage(keyboardId, filter);
    const handUsage: Map<number, number> = new Map();

    for (const count of counts) {
      handUsage.set(count.hand, count.count);
    }

    return Object.fromEntries(handUsage);
  }

  async getFingerUsage(
    keyboardId: number,
    filter: FilterOptions = {},
  ): Promise<{ [key: number]: number }> {
    const counts = await this.#recordRepo.getFingerUsage(keyboardId, filter);
    const fingerUsage: Map<number, number> = new Map();

    for (const count of counts) {
      fingerUsage.set(count.finger, count.count);
    }

    return Object.fromEntries(fingerUsage);
  }

  async getAvailableDates(keyboardId: number): Promise<Date[]> {
    const dates = await this.#recordRepo.getAvailableDates(keyboardId);

    return dates.map((dateString) => {
      const [year, month, day] = dateString.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      return date;
    });
  }
}
