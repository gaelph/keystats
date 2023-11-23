import dayjs, { type Dayjs } from "dayjs";
import { z } from "zod";

const dayJs = () => {
  return z.preprocess(
    (arg) => (typeof arg == "string" ? dayjs(arg) : undefined),
    z.instanceof(dayjs as unknown as typeof Dayjs),
  );
};

export const keyboardIdParam = z.object({
  keyboardId: z.coerce.number(),
});

export type KeyboardIdParam = z.infer<typeof keyboardIdParam>;

export const filterQuery = z.object({
  date: z.optional(dayJs()),
});

export type FilterQuery = z.infer<typeof filterQuery>;

export function serializeFilterQuery(
  query: FilterQuery,
): Record<string, string> {
  const { date } = query;
  const serializable: Record<string, string> = {};

  if (query.date) {
    if (dayjs.isDayjs(date)) {
      serializable.date = date.format("YYYY-MM-DD");
    }
  }

  return serializable;
}

export const keyboardListBody = z.object({
  keyboards: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

export type KeyboardListBody = z.infer<typeof keyboardListBody>;

const keymap = z.object({
  keycode: z.string(),
  type: z.enum(["plain", "mtap", "ltap", "lmod", "layer"]),
  character: z.string().optional(),
});

export type Keymap = z.infer<typeof keymap>;

export const keymapsBody = z.object({
  keymaps: z.array(z.array(z.array(z.array(keymap)))),
});

export type KeymapsBody = z.infer<typeof keymapsBody>;

export const datesBody = z.object({
  dates: z.array(z.coerce.date()),
});

export type DatesBody = z.infer<typeof datesBody>;

const keymapUsage = z.array(
  z.array(z.array(z.number().default(0)).default([])).default([]),
);
const layerUsage = z.record(z.string(), z.number().default(0));
const rowUsage = z.record(z.string(), z.number().default(0));
const handUsage = z.object({
  0: z.number().default(0),
  1: z.number().default(0),
});
const fingerUsage = z.object({
  0: z.number().default(0),
  1: z.number().default(0),
  2: z.number().default(0),
  3: z.number().default(0),
  4: z.number().default(0),
  5: z.number().default(0),
  6: z.number().default(0),
  7: z.number().default(0),
  8: z.number().default(0),
  9: z.number().default(0),
});
const totalKeypresses = z.number();

export type KeymapUsage = z.infer<typeof keymapUsage>;
export type LayerUsage = z.infer<typeof layerUsage>;
export type RowUsage = z.infer<typeof rowUsage>;
export type HandUsage = z.infer<typeof handUsage>;
export type FingerUsage = z.infer<typeof fingerUsage>;

export const totalCountBody = z.object({
  keymapUsage: keymapUsage,
  layerUsage: layerUsage,
  rowUsage: rowUsage,
  handUsage: handUsage,
  fingerUsage: fingerUsage,
  totalKeypresses: totalKeypresses,
});

export type TotalCountBody = z.infer<typeof totalCountBody>;

const character = z.object({
  keycode: z.string(),
  modifiers: z.number(),
  counts: z.number(),
  character: z.string().optional(),
});

export type Character = z.infer<typeof character>;

export const characterCountBody = z.object({
  records: z.array(character).default([]),
  totalCharacters: z.number().default(0),
});

export type CharacterCountBody = z.infer<typeof characterCountBody>;

const handRepetitions = z.array(z.array(z.number().default(0))).length(2);
export type HandRepetitions = z.infer<typeof handRepetitions>;

const fingerRepetitions = z.array(z.array(z.number().default(0))).length(10);
export type FingerRepetitions = z.infer<typeof fingerRepetitions>;

export const repetitionsBody = z.object({
  handRepetitions: handRepetitions,
  fingerRepetitions: fingerRepetitions,
});

export type RepetitionsBody = z.infer<typeof repetitionsBody>;
