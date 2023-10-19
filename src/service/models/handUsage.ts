import { todayAsDbDate } from "../../utils/time.js";
import Model from "./model.js";

export type HandUsageOptions = Pick<
  HandUsage,
  | "id"
  | "hand"
  | "repeats"
  | "count"
  | "keyboardId"
  | "createdAt"
  | "updatedAt"
  | "date"
>;

export default class HandUsage extends Model {
  static table: "hand_usage" = "hand_usage";

  id?: number;
  hand: number;
  repeats: number;
  count: number;
  date?: string;
  createdAt?: Date;
  updatedAt?: Date;
  keyboardId: number;

  constructor(options: HandUsageOptions) {
    super(options);

    this.id = options.id;
    this.hand = options.hand;
    this.repeats = options.repeats;
    this.count = options.count || 1;
    this.date = options.date || todayAsDbDate();
    this.createdAt = options.createdAt || new Date();
    this.updatedAt = options.updatedAt || new Date();

    this.keyboardId = options.keyboardId;
  }
}
