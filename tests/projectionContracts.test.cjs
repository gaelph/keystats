const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/common/src/dto/projection.ts");
const base = { keyboardId: 343, date: null, sourceEventCount: 2,
  groups: [{ keycode: "14", modifiers: 0, type: "plain", count: 2 }] };

test("observed metadata must reconcile with the same source snapshot", async () => {
  const { projectionSource } = await loaded;
  const observed = { keymaps: [], keymapUsage: [[[2]]], totalKeypresses: 2 };
  assert.ok(projectionSource.safeParse({ ...base, observed }).success);
  assert.equal(projectionSource.safeParse({ ...base, observed: { ...observed, totalKeypresses: 3 } }).success, false);
  assert.equal(projectionSource.safeParse({ ...base, observed: { ...observed, keymapUsage: [[[1]]] } }).success, false);
});

test("legacy source-only inputs and sparse observed layers remain supported", async () => {
  const { projectionSource } = await loaded;
  assert.ok(projectionSource.safeParse(base).success);
  const matrix = []; matrix[2] = [[2]];
  const parsed = projectionSource.parse({ ...base, observed: { keymaps: [], keymapUsage: matrix, totalKeypresses: 2 } });
  assert.deepEqual(parsed.observed.keymapUsage, [[], [], [[2]]]);
});

test("physical assignments accept missing metadata explicitly, never invalid fingers or coordinates", async () => {
  const { observedProjection } = await loaded;
  const observed = { keymaps: [], keymapUsage: [], totalKeypresses: 0 };
  assert.ok(observedProjection.safeParse({ ...observed, physicalKeys: [{ row: 0, column: 0, hand: null, finger: null }] }).success);
  for (const key of [
    { row: -1, column: 0, hand: 0, finger: 0 }, { row: 0, column: 0.5, hand: 0, finger: 0 },
    { row: 0, column: 0, hand: 2, finger: 0 }, { row: 0, column: 0, hand: 0, finger: 10 },
  ]) assert.equal(observedProjection.safeParse({ ...observed, physicalKeys: [key] }).success, false);
});

test("printing contracts reconcile retained/excluded records separately from modifier participation", async () => {
  const { projectionSource } = await loaded;
  const action = { keycode: "14", modifiers: 2, type: "plain", count: 1 };
  const printing = { groups: [action], sourceEventCount: 1, excludedEventCount: 1, modifierParticipationCount: 1,
    observed: { keymaps: [], keymapUsage: [[[1, 1]]], totalKeypresses: 2, unplacedUses: 0 } };
  const source = { ...base, groups: [action, { keycode: "e1", modifiers: 0, type: "mtap", count: 1 }], printing };
  assert.ok(projectionSource.safeParse(source).success);
  for (const change of [{ sourceEventCount: 2 }, { excludedEventCount: 2 }, { modifierParticipationCount: 0 },
    { observed: { ...printing.observed, totalKeypresses: 1 } }, { observed: { ...printing.observed, keymapUsage: [[[1]]] } }]) {
    assert.equal(projectionSource.safeParse({ ...source, printing: { ...printing, ...change } }).success, false);
  }
  assert.ok(projectionSource.safeParse({ ...source, printing: { ...printing,
    observed: { ...printing.observed, keymapUsage: [[[1]]], unplacedUses: 1 } } }).success);
});
