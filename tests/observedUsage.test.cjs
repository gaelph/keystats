const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/common/src/projection/usage.ts");
const legend = (character) => [{ keycode: "14", type: "plain", character }];
const sum = (counts) => Object.values(counts).reduce((a, b) => a + b, 0);

test("all layers merge at physical coordinates, retaining only first-layer legends", async () => {
  const { mergeObservedLayers, observedUsage } = await loaded;
  const observed = {
    keymaps: [[[legend("A"), legend("B")]], [], [[legend("OTHER")], [legend("LATER")]]],
    keymapUsage: [[[4, 1]], [], [[6], [3]]], totalKeypresses: 14,
    physicalKeys: [
      { row: 0, column: 0, hand: 0, finger: 4 }, { row: 0, column: 1, hand: 1, finger: 6 },
      { row: 1, column: 0, hand: 1, finger: 9 },
    ],
  };
  const before = JSON.stringify(observed);
  const { matrix, layer } = mergeObservedLayers(observed);
  assert.deepEqual(matrix, [[10, 1], [3, 0]]);
  assert.deepEqual(layer, [[legend("A"), legend("B")], [[], []]]);
  const usage = observedUsage(observed);
  assert.equal(usage.rows.top, 11);
  assert.equal(usage.rows.home, 3);
  assert.deepEqual(usage.hands, { left: 10, right: 4, unplaced: 0 });
  assert.equal(usage.fingers["left-thumb"], 10); // Configuration, not the displayed A's standard finger
  assert.equal(usage.fingers["right-index"], 1);
  assert.equal(usage.fingers["right-pinkie"], 3);
  for (const distribution of [usage.rows, usage.hands, usage.fingers]) assert.equal(sum(distribution), 14);
  assert.equal(JSON.stringify(observed), before);
});

test("physical rows retain top/home/bottom/thumb semantics, regardless of layer glyphs", async () => {
  const { observedUsage } = await loaded;
  const usage = observedUsage({ keymaps: [], keymapUsage: [[[2], [3], [5], [7]], [[11], [13], [17], [19]]],
    totalKeypresses: 77, physicalKeys: [] });
  assert.deepEqual(usage.rows, { function: 0, number: 0, top: 13, home: 16, bottom: 22, thumb: 26, navigation: 0, unplaced: 0 });
  assert.equal(usage.hands.unplaced, 77);
  assert.equal(usage.fingers.unassigned, 77);
});

test("missing first-layer labels and unknown assignments never discard later-layer presses", async () => {
  const { mergeObservedLayers, observedUsage } = await loaded;
  const observed = { keymaps: [[], [[legend("X")]]], keymapUsage: [[], [[9]], [], [[], [0, 2]]], totalKeypresses: 11,
    physicalKeys: [{ row: 0, column: 0, hand: 1, finger: null }, { row: 1, column: 1, hand: null, finger: 4 }] };
  assert.deepEqual(mergeObservedLayers(observed).layer, [[[], []], [[], []]]);
  const usage = observedUsage(observed);
  assert.equal(usage.hands.right, 9);
  assert.equal(usage.hands.unplaced, 2);
  assert.equal(usage.fingers["left-thumb"], 2);
  assert.equal(usage.fingers.unassigned, 9);
  for (const distribution of [usage.rows, usage.hands, usage.fingers]) assert.equal(sum(distribution), 11);
});

test("empty and legacy responses have stable zero distributions without invented assignments", async () => {
  const { mergeObservedLayers, observedUsage } = await loaded;
  const empty = { keymaps: [], keymapUsage: [], totalKeypresses: 0 };
  assert.deepEqual(mergeObservedLayers(empty), { matrix: [], layer: [] });
  const usage = observedUsage(empty);
  for (const distribution of [usage.rows, usage.hands, usage.fingers]) assert.equal(sum(distribution), 0);
  const legacy = observedUsage({ ...empty, keymapUsage: [[[4]]], totalKeypresses: 4 });
  assert.equal(legacy.hands.unplaced, 4);
  assert.equal(legacy.fingers.unassigned, 4);
});
