const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/service/trends.ts");
const position = (date, keycode, count, modifiers = 0, row = 1, column = 0, layer = 0) =>
  ({ date, keycode, count, modifiers, type: "plain", row, column, layer });
const observed = { keymaps: [[[], [], [], [[{ keycode: "e1", type: "plain" }]]]], keymapUsage: [], totalKeypresses: 0,
  physicalKeys: [{ row: 1, column: 0, hand: 0, finger: 1 }, { row: 3, column: 0, hand: 0, finger: 0 }] };

test("daily gaps, shortcuts, Space and estimated modifier uses remain distinct", async () => {
  const { makeTrends } = await loaded;
  const rows = [position("2026-11-02", "14", 4, 2), position("2026-11-02", "14", 3, 8),
    position("2026-11-02", "2c", 2), position("2026-11-04", "2a", 6)];
  const result = makeTrends(1, "2026-11-02", "2026-11-04", "daily", rows, rows, observed, "2026-11-04");
  const [first, gap, last] = result.buckets;
  assert.equal(first.recorded, 9);
  assert.equal(first.printing, 6); // Shortcut is a glyph but not a printing action.
  assert.equal(first.characterTotal, 9);
  assert.equal(first.characters.A, 4);
  assert.equal(first.characters.a, 3);
  assert.equal(first.characters[" "], 2);
  assert.equal(first.printingUsage.total, 10); // Four shifted actions participate at two positions.
  assert.equal(first.allUsage.total, 9);
  assert.equal(gap.recordedDays, 0);
  assert.equal(gap.allUsage, null);
  assert.equal(last.printingUsage.total, 0);
  assert.equal(last.characterTotal, 0);
  assert.equal(last.controls.Backspace, 6);
  assert.equal(last.controlTotal, 6);
  assert.deepEqual(result.controls, ["Backspace"]);
  assert.equal(last.partial, true);
});

test("named controls include modified presses, are keyboard-history wide and count independently of characters", async () => {
  const { makeTrends } = await loaded;
  const rows = [position("2026-11-02", "2a", 3), position("2026-11-02", "2a", 2, 8), position("2026-11-02", "28", 4), position("2026-11-02", "14", 1)];
  const history = [...rows, position("2026-10-01", "2b", 1)];
  const result = makeTrends(1, "2026-11-02", "2026-11-03", "daily", rows, history, observed, "2026-11-03");
  assert.deepEqual(result.controls, ["Backspace", "Enter", "Tab"]);
  assert.equal(result.buckets[0].controls.Backspace, 5);
  assert.equal(result.buckets[0].controls.Enter, 4);
  assert.equal(result.buckets[0].characterTotal + result.buckets[0].controlTotal, 10);
  assert.equal(result.buckets[1].controlTotal, 0);
});

test("weeks start Monday, clip at range edges, and count missing days without extrapolation", async () => {
  const { makeTrends } = await loaded;
  const rows = [position("2026-11-04", "14", 10), position("2026-11-09", "14", 5)];
  const result = makeTrends(1, "2026-11-04", "2026-11-10", "weekly", rows, rows, observed, "2026-11-15");
  assert.deepEqual(result.buckets.map((b) => [b.start, b.end, b.recordedDays, b.calendarDays, b.recorded, b.partial]), [
    ["2026-11-04", "2026-11-08", 1, 5, 10, true], ["2026-11-09", "2026-11-10", 1, 2, 5, true],
  ]);
  assert.equal(result.buckets[0].allUsage.total, 10);
});

test("monthly buckets span leap days and retain empty periods", async () => {
  const { makeTrends } = await loaded;
  const result = makeTrends(1, "2024-02-28", "2024-03-02", "monthly", [], [], observed, "2024-03-10");
  assert.deepEqual(result.buckets.map((b) => [b.start, b.end, b.calendarDays, b.recordedDays]), [
    ["2024-02-28", "2024-02-29", 2, 0], ["2024-03-01", "2024-03-02", 2, 0],
  ]);
});
