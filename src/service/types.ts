import { KeymapType } from "./models/keymap.js";
import type { Dayjs } from "dayjs";

export interface Coordinates {
  layer: number;
  column: number;
  row: number;
}

export interface FilterOptions {
  date?: Dayjs;
  period?: Dayjs[];
  after?: Dayjs;
  before?: Dayjs;
  type?: KeymapType;
}
