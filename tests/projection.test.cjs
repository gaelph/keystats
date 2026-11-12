const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/common/src/projection/index.ts");
const group = (keycode, count = 1, modifiers = 0, type = "plain") => ({ keycode, count, modifiers, type });
const source = (...groups) => ({ keyboardId: 343, date: null, groups,
  sourceEventCount: groups.reduce((sum, item) => sum + item.count, 0) });
async function projections(input) {
  const { project, frenchProfile, usProfile } = await loaded;
  return [project(input, frenchProfile, frenchProfile), project(input, frenchProfile, usProfile)];
}

test("native profiles have independently known letters, ISO positions and dead-key definitions", async () => {
  const { frenchProfile: fr, usProfile: us } = await loaded;
  const output = (profile, usage, modifiers = 0) => profile.outputs.find((o) => o.usage === usage && o.modifiers === modifiers);
  assert.equal(output(fr, 20).glyph, "a");
  assert.equal(output(us, 20).glyph, "q");
  assert.equal(output(fr, 29, 2).glyph, "W");
  assert.equal(output(fr, 53).glyph, "@");
  assert.equal(output(fr, 100).glyph, "<");
  assert.equal(output(fr, 47).dead, true);
  assert.equal(output(fr, 47).commitVerified, true);
  assert.equal(output(fr, 33, 6).glyph, "’");
  assert.equal(output(us, 48, 6).glyph, "’");
  assert.equal(output(fr, 99).glyph, ",");
  assert.equal(output(fr, 99, 2).glyph, ".");
  for (const profile of [fr, us]) {
    const ids = new Set(profile.keys.map((key) => key.id));
    assert.equal(ids.size, profile.keys.length);
    for (const routes of [...profile.glyphRoutes.values(), ...profile.controlRoutes.values()]) {
      for (const route of routes) for (const step of route.steps) assert.ok(ids.has(step.keyId));
    }
  }
  assert.ok(!us.keys.some((key) => key.id === "hid-64"));
});

test("transpose the interpreted letter, not the original HID position", async () => {
  const [fr, us] = await projections(source(group("14", 100)));
  assert.equal(fr.keyUses["hid-14"], 100);
  assert.equal(us.keyUses["hid-4"], 100);
  assert.equal(us.keyUses["hid-14"], 0);
});

test("replace text modifiers and never double count recorded modifier holds", async () => {
  const [fr, us] = await projections(source(group("1e", 10, 2), group("e1", 10, 0, "mtap")));
  assert.equal(fr.keyUses["hid-1e"], 10);
  assert.equal(fr.keyUses["hid-e5"], 10); // opposite the left-hand 1 key
  assert.equal(fr.keyUses["hid-e1"], 0);
  assert.equal(fr.sourceModifierCount, 10);
  assert.equal(fr.estimatedUseCount, 20);
  assert.equal(us.estimatedUseCount, 10);
  assert.equal(us.modifierUses.Shift, 0);
});

test("shortcut decoding consumes source Shift but retains Command", async () => {
  const [, us] = await projections(source(group("1e", 3, 0x0a)));
  assert.equal(us.keyUses["hid-1e"], 3);
  assert.equal(us.keyUses["hid-e3"], 3);
  assert.equal(us.modifierUses.Shift, 0);
  assert.equal(us.estimatedUseCount, 6);
});

test("normalize embedded QMK modifiers without doubling separately reported modifier bits", async () => {
  const [, us] = await projections(source(group("236", 7, 2), group("1104", 3), group("42d", 4)));
  assert.equal(us.keyUses["hid-37"], 7); // French Shift+semicolon is a literal dot
  assert.equal(us.keyUses["hid-14"], 3); // French q -> US q, retained right Control
  assert.equal(us.unplacedModifiers["right Control"], 3);
  assert.equal(us.keyUses["hid-30"], 4); // French Option+) is }, US Shift+]
  assert.equal(us.modifierUses.Shift, 4);
  assert.equal(us.unmappedActionCount, 0);
});

test("named controls retain meaningful modifier families with target side allocation", async () => {
  const [fr] = await projections(source(group("2b", 3, 2), group("2a", 2, 0x40)));
  assert.equal(fr.keyUses["hid-2b"], 3);
  assert.equal(fr.keyUses["hid-e5"], 3);
  assert.equal(fr.keyUses["hid-e2"], 2);
  assert.equal(fr.keyUses["hid-e6"], 0);
});

test("literal glyph recipes count commit Space and per-step modifiers", async () => {
  const [fr, us] = await projections(source(group("7e4f", 10), group("2c", 5)));
  assert.equal(fr.keyUses["hid-2f"], 10);
  assert.equal(fr.keyUses["hid-2c"], 15);
  assert.equal(fr.recipeActionCount, 10);
  assert.equal(fr.estimatedUseCount, 25);
  assert.equal(us.keyUses["hid-23"], 10);
  assert.equal(us.keyUses["hid-e1"], 10); // 6 uses the right hand
  assert.equal(us.keyUses["hid-2c"], 5);
  const [tilde] = await projections(source(group("7e51", 7)));
  assert.equal(tilde.keyUses["hid-11"], 7);
  assert.equal(tilde.keyUses["hid-e2"], 7);
  assert.equal(tilde.keyUses["hid-2c"], 7);
  assert.equal(tilde.estimatedUseCount, 21); // commit Space doesn't inherit Option
});

test("ordinary dead keys, unknown layer/custom actions and composed output remain visible", async () => {
  const [fr, us] = await projections(source(group("2f", 4), group("7e40", 2), group("2", 3, 0, "ltap"), group("1f", 5)));
  assert.equal(fr.unmappedActionCount, 9);
  assert.equal(us.unmappedActionCount, 9); // é now has an approved target-side recipe
  assert.equal(us.compositionActionCount, 5);
  assert.equal(us.unmapped.find((entry) => entry.source.keycode === "2f").reason, "source-dead-key");
});

test("never substitute a multi-step text recipe for a shortcut", async () => {
  const [fr, us] = await projections(source(group("7e4f", 8, 8)));
  assert.equal(fr.unmappedActionCount, 8);
  assert.equal(fr.unmapped[0].reason, "shortcut-needs-composition");
  assert.equal(fr.estimatedUseCount, 0);
  assert.equal(us.estimatedUseCount, 24); // 6 + Shift + Command
});

test("curly apostrophe remains distinct and selects its validated route", async () => {
  const [, us] = await projections(source(group("7e52", 4)));
  assert.equal(us.keyUses["hid-30"], 4);
  assert.equal(us.keyUses["hid-e1"], 4);
  assert.equal(us.keyUses["hid-e2"], 4);
  assert.equal(us.estimatedUseCount, 12);
});

test("compact controls, function row and keypad semantic routes are explicit", async () => {
  const [fr] = await projections(source(group("4b", 10), group("3a", 2), group("be", 3), group("59", 4)));
  assert.equal(fr.keyUses["hid-52"], 10);
  assert.equal(fr.keyUses.fn, 12);
  assert.equal(fr.keyUses["hid-3a"], 5);
  assert.equal(fr.keyUses["hid-1e"], 4);
  assert.equal(fr.modifierUses.Shift, 4);
});

test("keypad decimal interpretation comes from the French source profile, not a US label", async () => {
  const [, us] = await projections(source(group("63", 3), group("63", 2, 2)));
  assert.equal(us.keyUses["hid-36"], 3); // French keypad decimal is comma
  assert.equal(us.keyUses["hid-37"], 2); // Shift+keypad decimal is dot
  assert.equal(us.modifierUses.Shift, 0);
});

test("missing Right Control stays in an unplaced family bucket", async () => {
  const [, us] = await projections(source(group("14", 6, 0x10)));
  assert.equal(us.keyUses["hid-4"], 6);
  assert.equal(us.keyUses["hid-e0"], 0);
  assert.equal(us.unplacedModifiers["right Control"], 6);
  assert.equal(us.modifierUses.Control, 6);
  assert.equal(us.estimatedUseCount, 12);
});

test("accounting reconciles, input stays immutable, and duplicates merge by key use", async () => {
  const input = source(group("14", 4), group("0014", 6), group("7e50", 3), group("e3", 2, 0, "mtap"));
  const before = JSON.stringify(input);
  for (const result of await projections(input)) {
    assert.equal(result.sourceModifierCount + result.baseActionCount, input.sourceEventCount);
    assert.equal(result.supportedActionCount + result.unmappedActionCount, result.baseActionCount);
    assert.equal(Object.values(result.keyUses).reduce((a, b) => a + b, 0) + Object.values(result.unplacedModifiers).reduce((a, b) => a + b, 0), result.estimatedUseCount);
  }
  assert.equal(JSON.stringify(input), before);
});

test("empty and modifier-only datasets are safe", async () => {
  for (const result of await projections(source(group("e0", 5, 0, "mtap")))) {
    assert.equal(result.baseActionCount, 0);
    assert.equal(result.estimatedUseCount, 0);
  }
  assert.equal((await projections(source()))[0].estimatedUseCount, 0);
});
