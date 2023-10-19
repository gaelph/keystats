import { todayAsDbDate } from "../../utils/time.js";
import Model from "./model.js";

export type FingerUsageOptions = Pick<
  FingerUsage,
  | "id"
  | "finger"
  | "repeats"
  | "count"
  | "date"
  | "keyboardId"
  | "createdAt"
  | "updatedAt"
>;

export default class FingerUsage extends Model {
  static table: "finger_usage" = "finger_usage";

  id?: number;
  finger: number;
  repeats: number;
  count: number;
  date?: string;
  createdAt?: Date;
  updatedAt?: Date;
  keyboardId: number;

  constructor(options: FingerUsageOptions) {
    super(options);

    this.id = options.id;
    this.finger = options.finger;
    this.repeats = options.repeats;
    this.count = options.count || 1;
    this.date = options.date || todayAsDbDate();
    this.createdAt = options.createdAt || new Date();
    this.updatedAt = options.updatedAt || new Date();
    this.keyboardId = options.keyboardId;
  }
}
