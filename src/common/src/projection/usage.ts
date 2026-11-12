import type { Finger, Hand, KeyRow, LayoutProfile, ProjectionResult } from "./types.js";
import type { ObservedProjection } from "../dto/projection.js";

export interface KeyboardUsage {
  total: number;
  rows: Record<KeyRow | "unplaced", number>;
  hands: Record<Hand | "unplaced", number>;
  fingers: Record<Finger | "unassigned", number>;
}

export type ProjectedUsage = KeyboardUsage;

function emptyUsage(total: number): KeyboardUsage {
  return {
    total,
    rows: { function: 0, number: 0, top: 0, home: 0, bottom: 0, thumb: 0, navigation: 0, unplaced: 0 },
    hands: { left: 0, right: 0, unplaced: 0 },
    fingers: { "left-pinkie": 0, "left-ring": 0, "left-middle": 0, "left-index": 0, "left-thumb": 0,
      "right-thumb": 0, "right-index": 0, "right-middle": 0, "right-ring": 0, "right-pinkie": 0, unassigned: 0 },
  };
}

// First-layer legends are presentation only. Every layer contributes at its
// physical row/column, including positions with no first-layer legend.
export function mergeObservedLayers(observed: ObservedProjection) {
  const rowCount = Math.max(0, ...observed.keymaps.map((layer) => layer.length),
    ...observed.keymapUsage.map((layer) => layer.length),
    ...(observed.physicalKeys || []).map((key) => key.row + 1));
  const columnCount = Math.max(0, ...observed.keymaps.flatMap((layer) => layer.map((row) => row.length)),
    ...observed.keymapUsage.flatMap((layer) => layer.map((row) => row.length)),
    ...(observed.physicalKeys || []).map((key) => key.column + 1));
  const matrix = Array.from({ length: rowCount }, () => Array<number>(columnCount).fill(0));
  for (const layer of observed.keymapUsage) {
    layer.forEach((row, r) => row.forEach((count, c) => { matrix[r][c] += count; }));
  }
  const layer = matrix.map((row, r) => row.map((_, c) => observed.keymaps[0]?.[r]?.[c] || []));
  return { matrix, layer };
}

const fingerOrder: readonly Finger[] = ["left-pinkie", "left-ring", "left-middle", "left-index", "left-thumb",
  "right-thumb", "right-index", "right-middle", "right-ring", "right-pinkie"];
const observedRows: readonly KeyRow[] = ["top", "home", "bottom", "thumb"];

export function observedUsage(observed: ObservedProjection): KeyboardUsage {
  const usage = emptyUsage(observed.totalKeypresses);
  const { matrix } = mergeObservedLayers(observed);
  const keys = new Map((observed.physicalKeys || []).map((key) => [`${key.row}/${key.column}`, key]));
  let total = 0;
  matrix.forEach((row, r) => row.forEach((count, c) => {
    const key = keys.get(`${r}/${c}`);
    usage.rows[observedRows[r] || "unplaced"] += count;
    usage.hands[key?.hand === 0 ? "left" : key?.hand === 1 ? "right" : "unplaced"] += count;
    usage.fingers[key?.finger != null ? fingerOrder[key.finger] || "unassigned" : "unassigned"] += count;
    total += count;
  }));
  const unplaced = observed.unplacedUses || 0;
  usage.rows.unplaced += unplaced;
  usage.hands.unplaced += unplaced;
  usage.fingers.unassigned += unplaced;
  if (total + unplaced !== usage.total) throw new Error("Observed usage does not reconcile");
  return usage;
}

// Sum the already projected key uses: never re-project recorded hand/finger
// aggregates, which describe the recording keyboard rather than the target.
export function projectedUsage(result: ProjectionResult, profile: LayoutProfile): ProjectedUsage {
  const usage = emptyUsage(result.estimatedUseCount);
  const keys = new Map(profile.keys.map((key) => [key.id, key]));
  let placed = 0;
  for (const [id, count] of Object.entries(result.keyUses)) {
    const key = keys.get(id);
    if (!key) throw new Error(`Unknown reference key: ${profile.id}/${id}`);
    usage.rows[key.row] += count;
    usage.hands[key.hand] += count;
    usage.fingers[key.finger || "unassigned"] += count;
    placed += count;
  }
  const unplaced = Object.values(result.unplacedModifiers).reduce((sum, count) => sum + count, 0);
  usage.rows.unplaced = unplaced;
  usage.hands.unplaced = unplaced;
  usage.fingers.unassigned += unplaced;
  if (placed + unplaced !== usage.total) throw new Error("Projected usage does not reconcile");
  return usage;
}
