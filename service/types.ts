import { KeymapType } from "./models/keymap.js";

export interface Coordinates {
  layer: number;
  column: number;
  row: number;
}

export interface FilterOptions {
  date?: Date;
  period?: Date[];
  after?: Date;
  before?: Date;
  type?: KeymapType;
}
