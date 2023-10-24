import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import type { Dayjs } from "dayjs";

export function toDbDate(date: Dayjs): string {
  return date.format("YYYY-M-DD");
}

export function fromDbDate(input: string): Dayjs {
  // @ts-ignore
  return dayjs.parse(input, "YYYY-M-DD");
}

export function todayAsDbDate(): string {
  return toDbDate(dayjs());
}
