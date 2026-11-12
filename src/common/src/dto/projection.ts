import { z } from "zod";
import { keymapsBody, totalCountBody } from "./keyboard.js";

export const projectionDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(
  (value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  },
  "Invalid calendar date",
);
export const projectionQuery = z.object({ date: projectionDate.optional() }).strict();
export const projectionKeyboardParam = z.object({
  keyboardId: z.coerce.number().int().positive().safe(),
});
const count = z.number().int().nonnegative().safe();
export const projectionGroup = z.object({
  keycode: z.string().regex(/^[0-9a-f]{1,4}$/),
  modifiers: z.number().int().min(0).max(255),
  type: z.enum(["plain", "mtap", "ltap", "lmod", "layer"]),
  count,
}).strict();
export const projectionPositionGroup = projectionGroup.extend({ layer: count, row: count, column: count });
export const observedProjection = z.object({
  keymaps: keymapsBody.shape.keymaps,
  keymapUsage: totalCountBody.shape.keymapUsage,
  totalKeypresses: count,
  unplacedUses: count.optional(),
  physicalKeys: z.array(z.object({
    row: count,
    column: count,
    hand: z.number().int().min(0).max(1).nullable(),
    finger: z.number().int().min(0).max(9).nullable(),
  }).strict()).optional(),
}).strict();
export const printingProjection = z.object({
  groups: z.array(projectionGroup),
  sourceEventCount: count,
  excludedEventCount: count,
  modifierParticipationCount: count,
  observed: observedProjection,
}).strict().refine(
  (value) => value.groups.reduce((sum, group) => sum + group.count, 0) === value.sourceEventCount &&
    value.observed.totalKeypresses === value.sourceEventCount + value.modifierParticipationCount &&
    value.observed.keymapUsage.flat(2).reduce((sum, uses) => sum + uses, 0) +
      (value.observed.unplacedUses || 0) === value.observed.totalKeypresses,
  "Printing actions and modifier participation must reconcile with placed and unplaced uses",
);
export const projectionSource = z.object({
  keyboardId: z.number().int().positive().safe(),
  date: projectionDate.nullable(),
  sourceEventCount: count,
  groups: z.array(projectionGroup),
  observed: observedProjection.optional(),
  printing: printingProjection.optional(),
}).strict().refine(
  (value) => value.groups.reduce((sum, group) => sum + group.count, 0) === value.sourceEventCount,
  "Source groups must reconcile with the event count",
).refine(
  (value) => !value.observed || (value.observed.totalKeypresses === value.sourceEventCount &&
    value.observed.keymapUsage.flat(2).reduce((sum, presses) => sum + presses, 0) === value.sourceEventCount &&
    !value.observed.unplacedUses),
  "Observed matrix and projected source must describe the same recorded events",
).refine(
  (value) => !value.printing || value.printing.sourceEventCount + value.printing.excludedEventCount === value.sourceEventCount,
  "Printing and excluded actions must describe the same source selection",
);

export type ProjectionGroup = z.infer<typeof projectionGroup>;
export type ProjectionSource = z.infer<typeof projectionSource>;
export type ObservedProjection = z.infer<typeof observedProjection>;
export type ProjectionPositionGroup = z.infer<typeof projectionPositionGroup>;
export type PrintingProjection = z.infer<typeof printingProjection>;
