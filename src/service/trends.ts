import { decode, frenchProfile, observedUsage, printingOnly } from "../common/dist/projection/index.js";
import type { ProjectionPositionGroup, ProjectionSource } from "../common/dist/dto/projection.js";
import type { TrendBucket, TrendGrouping, TrendsResponse } from "../common/dist/dto/trends.js";

type Position = ProjectionPositionGroup & { date: string };
const dayMs = 86400000;
const dateValue = (s: string) => Date.parse(`${s}T00:00:00Z`);
const dateString = (n: number) => new Date(n).toISOString().slice(0, 10);

function bucketBounds(date: string, grouping: TrendGrouping): [number, number] {
  const time = dateValue(date), d = new Date(time);
  if (grouping === "daily") return [time, time];
  if (grouping === "weekly") {
    const start = time - ((d.getUTCDay() + 6) % 7) * dayMs;
    return [start, start + 6 * dayMs];
  }
  return [Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1), Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)];
}

function glyph(group: ProjectionPositionGroup): string | null {
  const result = decode(group, frenchProfile);
  return result.kind === "glyph" && result.glyph.length > 0 && !/[\p{C}\p{Zl}\p{Zp}]/u.test(result.glyph) ? result.glyph : null;
}
function control(group: ProjectionPositionGroup): string | null {
  const result = decode(group, frenchProfile);
  return result.kind === "control" ? result.control : null;
}

/** Build aligned buckets from grouped records; an absent day is not a zero. */
export function makeTrends(keyboardId: number, start: string, end: string, grouping: TrendGrouping,
  positions: Position[], history: ProjectionPositionGroup[], observed: NonNullable<ProjectionSource["observed"]>, today: string): TrendsResponse {
  const byBucket = new Map<number, Position[]>();
  for (const row of positions) {
    const key = bucketBounds(row.date, grouping)[0];
    const list = byBucket.get(key) || [];
    list.push(row); byBucket.set(key, list);
  }
  // Zero-count candidates make modifier placement stable across all buckets.
  const candidates = history.filter((row) => decode(row, frenchProfile).kind === "modifier-only").map((row) => ({ ...row, count: 0 }));
  const characters = [...new Set(history.map(glyph).filter((c): c is string => c !== null))].sort((a, b) => a.localeCompare(b));
  const controls = [...new Set(history.map(control).filter((c): c is string => c !== null))].sort((a, b) => a.localeCompare(b));
  const buckets: TrendBucket[] = [];
  let cursor = dateValue(start);
  const last = dateValue(end);
  while (cursor <= last) {
    const [naturalStart, naturalEnd] = bucketBounds(dateString(cursor), grouping);
    const bucketEnd = Math.min(naturalEnd, last);
    const rows = byBucket.get(naturalStart) || [];
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const keymapUsage: number[][][] = [];
    const characterCounts: Record<string, number> = Object.create(null);
    const controlCounts: Record<string, number> = Object.create(null);
    for (const row of rows) {
      keymapUsage[row.layer] ||= [];
      keymapUsage[row.layer][row.row] ||= [];
      keymapUsage[row.layer][row.row][row.column] = (keymapUsage[row.layer][row.row][row.column] || 0) + row.count;
      const character = glyph(row);
      if (character !== null) characterCounts[character] = (characterCounts[character] || 0) + row.count;
      const namedControl = control(row);
      if (namedControl !== null) controlCounts[namedControl] = (controlCounts[namedControl] || 0) + row.count;
    }
    const matrix = Array.from(keymapUsage, (layer) => Array.from(layer || [], (row) => Array.from(row || [], (count) => count || 0)));
    const source: ProjectionSource = { keyboardId, date: null, groups: rows, sourceEventCount: total,
      observed: { ...observed, keymapUsage: matrix, totalKeypresses: total } };
    const printing = rows.length ? printingOnly(source, [...rows, ...candidates], frenchProfile) : null;
    buckets.push({ start: dateString(cursor), end: dateString(bucketEnd),
      partial: cursor !== naturalStart || bucketEnd !== naturalEnd || (cursor <= dateValue(today) && bucketEnd >= dateValue(today)),
      recordedDays: new Set(rows.map((row) => row.date)).size,
      calendarDays: (bucketEnd - cursor) / dayMs + 1, recorded: total, printing: printing?.sourceEventCount || 0,
      characters: characterCounts, characterTotal: Object.values(characterCounts).reduce((a, b) => a + b, 0),
      controls: controlCounts, controlTotal: Object.values(controlCounts).reduce((a, b) => a + b, 0),
      allUsage: rows.length ? observedUsage(source.observed!) : null,
      printingUsage: printing ? observedUsage(printing.observed) : null,
    });
    cursor = bucketEnd + dayMs;
  }
  return { keyboardId, start, end, grouping, buckets, characters, controls, generatedAt: new Date().toISOString() };
}
