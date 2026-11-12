const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/common/src/projection/index.ts");
const group = (keycode, count = 1, modifiers = 0, type = "plain") => ({ keycode, count, modifiers, type });
const position = (item, row, column, layer = 0) => ({ ...item, row, column, layer });
function input(positions, modifiers = [["e1", 2, 0], ["e6", 3, 7]]) {
  const layer = Array.from({ length: 4 }, () => Array.from({ length: 12 }, () => []));
  for (const [keycode, row, column] of modifiers) layer[row][column] = [{ keycode, type: "plain", character: "MOD" }];
  const matrix = [];
  const groups = new Map();
  for (const item of positions) {
    matrix[item.layer] ||= []; matrix[item.layer][item.row] ||= [];
    matrix[item.layer][item.row][item.column] = (matrix[item.layer][item.row][item.column] || 0) + item.count;
    const key = `${item.keycode}/${item.modifiers}/${item.type}`;
    const existing = groups.get(key);
    if (existing) existing.count += item.count;
    else groups.set(key, group(item.keycode, item.count, item.modifiers, item.type));
  }
  const total = positions.reduce((sum, item) => sum + item.count, 0);
  return { keyboardId: 343, date: null, sourceEventCount: total, groups: [...groups.values()],
    observed: { keymaps: [layer], keymapUsage: matrix, totalKeypresses: total,
      physicalKeys: layer.flatMap((row, r) => row.map((_, c) => ({ row: r, column: c, hand: c < 6 ? 0 : 1, finger: c < 6 ? 0 : 9 }))) } };
}

test("printing classification keeps glyphs/Space and Shift/Option text, never controls or shortcuts", async () => {
  const { isPrintingAction, frenchProfile: fr } = await loaded;
  for (const item of [group("14"), group("14", 1, 2), group("1e", 1, 0x20), group("2d", 1, 0x40),
    group("2c"), group("63"), group("7e4f"), group("7e52"), group("236")]) {
    assert.equal(isPrintingAction(item, fr), true, JSON.stringify(item));
  }
  for (const item of [group("28"), group("2b"), group("2a"), group("4f"), group("3a"), group("be"),
    group("14", 1, 1), group("14", 1, 0x10), group("14", 1, 8), group("14", 1, 0x80),
    group("1e", 1, 0x0a), group("2c", 1, 8), group("814"), group("1114"),
    group("e1"), group("e6", 1, 0, "mtap"), group("7e40"), group("2f"), group("14", 1, 0, "ltap")]) {
    assert.equal(isPrintingAction(item, fr), false, JSON.stringify(item));
  }
});

test("printing source retains recorded coordinates and adds per-action Shift/Option without reusing hold counts", async () => {
  const { printingOnly, frenchProfile: fr, targetProfiles, project, observedUsage, mergeObservedLayers } = await loaded;
  const positions = [position(group("14", 7, 2), 1, 1, 2), position(group("e1", 99, 0, "mtap"), 2, 0),
    position(group("e6", 6), 3, 7), position(group("2d", 4, 0x40), 0, 2), position(group("2c", 5), 3, 5),
    position(group("4f", 3), 3, 11), position(group("14", 9, 8), 1, 1), position(group("7e4f", 2), 0, 3)];
  const source = input(positions);
  const before = JSON.stringify(source);
  const filtered = printingOnly(source, positions, fr);
  assert.equal(filtered.sourceEventCount, 18);
  assert.equal(filtered.excludedEventCount, 117);
  assert.equal(filtered.modifierParticipationCount, 11);
  assert.equal(filtered.observed.totalKeypresses, 29);
  const { matrix } = mergeObservedLayers(filtered.observed);
  assert.equal(matrix[1][1], 7); // not 7 + 9 shortcut uses, regardless of legend
  assert.equal(matrix[2][0], 7); // 7 participations, not 99 historical Shift holds
  assert.equal(matrix[3][7], 4); // retained text's right Option, not 6 independent holds
  assert.equal(matrix[3][11], 0);
  const usage = observedUsage(filtered.observed);
  assert.equal(usage.rows.top, 6);
  assert.equal(usage.rows.home, 7);
  assert.equal(usage.rows.bottom, 7);
  assert.equal(usage.rows.thumb, 9);
  for (const distribution of [usage.rows, usage.hands, usage.fingers]) {
    assert.equal(Object.values(distribution).reduce((a, b) => a + b, 0), 29);
  }
  for (const target of targetProfiles) {
    const result = project({ ...source, ...filtered }, fr, target);
    assert.equal(result.baseActionCount, 18);
    assert.equal(result.sourceModifierCount, 0);
    assert.ok(result.modifierUses.Shift + result.modifierUses.Option > 0);
    assert.equal(result.modifierUses.Command + result.modifierUses.Control, 0);
    assert.equal(result.keyUses["hid-4f"], 0);
  }
  assert.equal(JSON.stringify(source), before);
});

test("modifier positions must be unique across coordinates, while repeated layer declarations deduplicate", async () => {
  const { printingOnly, frenchProfile: fr, observedUsage } = await loaded;
  const positions = [position(group("14", 3, 6), 1, 1)];
  const ambiguous = printingOnly(input(positions, [["e1", 2, 0], ["e1", 2, 11]]), positions, fr);
  assert.equal(ambiguous.modifierParticipationCount, 6);
  assert.equal(ambiguous.observed.unplacedUses, 6);
  const usage = observedUsage(ambiguous.observed);
  assert.equal(usage.total, 9);
  assert.equal(usage.rows.home, 3);
  assert.equal(usage.rows.unplaced, 6);
  assert.equal(usage.hands.unplaced, 6);
  assert.equal(usage.fingers.unassigned, 6);
  const unique = input(positions, [["e1", 2, 0], ["e2", 3, 2]]);
  unique.observed.keymaps.push(unique.observed.keymaps[0]);
  const repeated = printingOnly(unique, positions, fr);
  assert.equal(repeated.observed.unplacedUses, 0);
  assert.equal(repeated.observed.totalKeypresses, 9);
});

test("firmware-embedded modifiers do not invent additional physical source keypresses", async () => {
  const { printingOnly, frenchProfile: fr, project, usProfile } = await loaded;
  const positions = [position(group("236", 5), 1, 1)];
  const source = input(positions);
  const filtered = printingOnly(source, positions, fr);
  assert.equal(filtered.observed.totalKeypresses, 5);
  assert.equal(filtered.modifierParticipationCount, 0);
  assert.equal(project({ ...source, ...filtered }, fr, usProfile).keyUses["hid-37"], 5);
});

test("source printing classification is independent of target support and preserves literal recipes", async () => {
  const { printingOnly, frenchProfile: fr, project, usProfile } = await loaded;
  const positions = [position(group("1f", 4), 0, 0), position(group("7e4f", 2), 1, 1)];
  const source = input(positions);
  const filtered = printingOnly(source, positions, fr);
  assert.equal(filtered.sourceEventCount, 6); // é is still printing even without a US route
  const french = project({ ...source, ...filtered }, fr, fr);
  assert.equal(french.recipeActionCount, 2);
  assert.equal(french.keyUses["hid-2c"], 2); // retain literal dead-key commit Space
  const american = project({ ...source, ...filtered }, fr, usProfile);
  assert.equal(american.unmappedActionCount, 0);
  assert.equal(american.compositionActionCount, 4);
  assert.equal(american.baseActionCount, 6);
  assert.equal(american.modifierUses.Shift, 2);
});

test("no printing data is an explicit zero selection; unsafe source mismatches fail", async () => {
  const { printingOnly, frenchProfile: fr, observedUsage } = await loaded;
  for (const positions of [[], [position(group("2a", 5), 0, 0), position(group("14", 3, 8), 1, 1)]]) {
    const source = input(positions);
    const filtered = printingOnly(source, positions, fr);
    assert.equal(filtered.sourceEventCount, 0);
    assert.equal(filtered.observed.totalKeypresses, 0);
    assert.equal(filtered.excludedEventCount, source.sourceEventCount);
    assert.equal(observedUsage(filtered.observed).total, 0);
  }
  assert.throws(() => printingOnly(input([position(group("14"), 1, 1)]), [], fr), /coordinates/);
});
