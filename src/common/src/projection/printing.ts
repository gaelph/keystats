import type { PrintingProjection, ProjectionGroup, ProjectionPositionGroup, ProjectionSource } from "../dto/projection.js";
import type { LayoutProfile } from "./types.js";
import { decode } from "./decode.js";
import { normalizeRecordedAction } from "./recordedAction.js";

export function isPrintingAction(group: ProjectionGroup, profile: LayoutProfile): boolean {
  const action = decode(group, profile);
  return action.kind === "glyph" && !action.shortcut && action.glyph.length > 0 &&
    !/[\p{C}\p{Zl}\p{Zp}]/u.test(action.glyph);
}

// The source contains daily aggregates, not modifier holds. In printing mode,
// retain recorded text actions and estimate modifier participation per action.
// A physical modifier is drawn only if its side-specific position is unique.
export function printingOnly(source: ProjectionSource, positions: readonly ProjectionPositionGroup[], profile: LayoutProfile): PrintingProjection {
  if (!source.observed) throw new Error("Printing comparison requires recorded coordinates");
  if (positions.reduce((sum, group) => sum + group.count, 0) !== source.sourceEventCount) {
    throw new Error("Printing coordinates do not match source events");
  }
  const groups = source.groups.filter((group) => isPrintingAction(group, profile));
  const sourceEventCount = groups.reduce((sum, group) => sum + group.count, 0);
  const modifierPositions = new Map<number, Map<string, { row: number; column: number }>>();
  const addModifier = (group: ProjectionGroup, row: number, column: number) => {
    if (decode(group, profile).kind !== "modifier-only") return;
    const { usage } = normalizeRecordedAction(group);
    const candidates = modifierPositions.get(usage) || new Map();
    candidates.set(`${row}/${column}`, { row, column });
    modifierPositions.set(usage, candidates);
  };
  source.observed.keymaps.forEach((layer) => layer.forEach((row, r) => row.forEach((keys, c) => {
    for (const key of keys) addModifier({ ...key, modifiers: 0, count: 0 }, r, c);
  })));
  for (const group of positions) addModifier(group, group.row, group.column);
  const keymapUsage: number[][][] = [];
  const addUse = (row: number, column: number, count: number) => {
    keymapUsage[0] ||= [];
    keymapUsage[0][row] ||= [];
    keymapUsage[0][row][column] = (keymapUsage[0][row][column] || 0) + count;
  };
  let modifierParticipationCount = 0, unplacedUses = 0, retainedPositions = 0;
  for (const group of positions) {
    if (!isPrintingAction(group, profile)) continue;
    retainedPositions += group.count;
    const participants = new Map([[`${group.row}/${group.column}`, { row: group.row, column: group.column }]]);
    for (const bit of [1, 2, 5, 6]) { // left/right Shift and Option only
      // Embedded QK_MODS describe firmware output, not another physical press.
      if (!(group.modifiers & (1 << bit))) continue;
      const candidates = modifierPositions.get(0xe0 + bit);
      if (candidates?.size === 1) {
        const position = candidates.values().next().value!;
        const key = `${position.row}/${position.column}`;
        if (!participants.has(key)) { participants.set(key, position); modifierParticipationCount += group.count; }
      } else {
        unplacedUses += group.count;
        modifierParticipationCount += group.count;
      }
    }
    for (const { row, column } of participants.values()) addUse(row, column, group.count);
  }
  if (retainedPositions !== sourceEventCount) throw new Error("Printing groups and coordinates do not reconcile");
  return {
    groups, sourceEventCount, excludedEventCount: source.sourceEventCount - sourceEventCount, modifierParticipationCount,
    observed: { keymaps: source.observed.keymaps, physicalKeys: source.observed.physicalKeys,
      keymapUsage: keymapUsage.map((layer) => Array.from(layer, (row) => Array.from(row || [], (count) => count || 0))),
      totalKeypresses: sourceEventCount + modifierParticipationCount, unplacedUses },
  };
}
