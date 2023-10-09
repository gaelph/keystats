import { KeymapType } from "./models/keymap.js";
import Record from "./models/record.js";
import RecordRepo from "./repository/recordRepo.js";

export default class RecordService {
  #recordRepo: RecordRepo;

  constructor(recordRepo: RecordRepo) {
    this.#recordRepo = recordRepo;
  }

  async addRecord(
    keyboardId: number,
    layerIndex: number,
    keycode: string,
    modifiers: number,
    row: number,
    column: number,
    type: KeymapType,
  ): Promise<Record | null> {
    try {
      return this.#recordRepo.addRecord(keyboardId, layerIndex, keycode, {
        type,
        modifiers,
        row,
        column,
        counts: 1,
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async getRecords(keyboardId: number): Promise<Record[][][][]> {
    const records = await this.#recordRepo.getRecords(keyboardId);
    const groupedRecords: Record[][][][] = [];

    for (const record of records) {
      const row = record.keymap!.key!.row;
      const column = record.keymap!.key!.column;
      const layer = record.keymap!.layer!.index;
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

  async getTotalCounts(keyboardId: number): Promise<number[][][]> {
    const counts = await this.#recordRepo.getTotalCounts(keyboardId);
    console.log("LS -> service/recordService.ts:59 -> counts: ", counts);
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

  async getPlainRecords(keyboardId: number): Promise<any[]> {
    const records = await this.#recordRepo.getPlainRecords(keyboardId);

    return records;
  }
}
