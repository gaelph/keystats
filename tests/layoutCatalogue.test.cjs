const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/common/src/projection/index.ts");
const source = (...groups) => ({ keyboardId: 343, date: null, groups,
  sourceEventCount: groups.reduce((sum, group) => sum + group.count, 0) });
const group = (keycode, count = 1, modifiers = 0) => ({ keycode, count, modifiers, type: "plain" });

test("five enabled registry entries have independent known base/Shift outputs and pinned provenance", async () => {
  const { targetRegistry: registry } = await loaded;
  assert.deepEqual(registry.map(entry => entry.id), ["qwerty", "azerty", "colemak-dh", "bepo", "isrt"]);
  assert.ok(registry.every(entry => entry.status === "available"), JSON.stringify(registry.map(e => [e.id, e.reason])));
  const get = id => registry.find(entry => entry.id === id).profile;
  const text = (profile, ids) => ids.map(id => profile.outputs.find(o => o.usage === id && !o.modifiers).glyph).join("");
  assert.equal(text(get("colemak-dh"), [20,26,8,21,23,28,24,12,18,19]), "qwfpbjluy;");
  assert.equal(text(get("colemak-dh"), [4,22,7,9,10,11,13,14,15,51]), "arstgmneio");
  assert.equal(text(get("colemak-dh"), [100,29,27,6,25]), "zxcdv");
  for (const [id, finger] of [[100,"left-pinkie"],[29,"left-ring"],[27,"left-middle"],[6,"left-index"]]) {
    assert.equal(get("colemak-dh").keys.find(key => key.id === `hid-${id.toString(16)}`).finger, finger);
  }
  assert.equal(text(get("bepo"), [20,26,8,21,23,28,24,12,18,19]), "bépoè^vdlj");
  assert.equal(text(get("bepo"), [4,22,7,9,10,11,13,14,15,51]), "auie,ctsrn");
  assert.equal(text(get("bepo"), [100,29,27,6,25]), "êàyx.");
  assert.equal(get("bepo").outputs.find(o => o.usage === 52 && o.modifiers === 0).glyph, "m");
  assert.equal(text(get("isrt"), [20,26,8,21,23,28,24,12,18,19]), "yclmkzfu,'");
  assert.equal(text(get("isrt"), [4,22,7,9,10,11,13,14,15,51,52]), "isrtgpneao;");
  assert.equal(text(get("isrt"), [29,27,6,25,5,17,16,54,55,56]), "qvwdjbh/.x");
  assert.equal(get("isrt").outputs.find(o => o.usage === 30 && o.modifiers === 2).glyph, "!");
  assert.equal(get("isrt").outputs.some(o => o.modifiers & 4), false);
  for (const id of ["colemak-dh", "bepo", "isrt"]) assert.match(registry.find(e => e.id === id).provenance, /SHA-256 [a-f0-9]{64}/);
});

test("French-letter recipes use counted participation, support uppercase, and never compose shortcuts", async () => {
  const { frenchProfile: fr, usProfile: us, project, targetRegistry } = await loaded;
  const result = project(source(group("1f", 4)), fr, us); // French é
  assert.equal(result.supportedActionCount, 4);
  assert.equal(result.compositionActionCount, 4);
  assert.equal(result.estimatedUseCount, 12); // Option+E, E
  assert.equal(result.keyUses["hid-8"], 8);
  assert.equal(result.modifierUses.Option, 4);
  const upperSource = { ...fr, outputs: [{ usage: 20, modifiers: 2, glyph: "É", dead: false, commitVerified: false }, ...fr.outputs] };
  const uppercase = project(source(group("14", 3, 2)), upperSource, us); // Synthetic decoded É; don't invent a source French mapping
  assert.equal(uppercase.unmappedActionCount, 0);
  assert.equal(uppercase.compositionActionCount, 3);
  assert.equal(uppercase.modifierUses.Shift, 3);
  for (const entry of targetRegistry) {
    const shortcut = project(source(group("1f", 2, 8)), fr, entry.profile);
    if (entry.id === "qwerty" || entry.id === "isrt") assert.equal(shortcut.unmappedActionCount, 2);
    for (const routes of entry.profile.glyphRoutes.values()) for (const route of routes) {
      if (route.recipe === "dead-key-composition") assert.equal(route.steps.length, 2);
    }
  }
});

test("exact-codepoint composition validation rejects canonical-equivalence and unbounded recipes", async () => {
  const { createProfile, frenchProfile, compositionCharacters } = await loaded;
  assert.equal(compositionCharacters.has("e\u0301"), false);
  assert.equal(compositionCharacters.has("é"), true);
  assert.throws(() => createProfile("invalid", "Invalid", [...frenchProfile.outputs], true,
    [{ glyph: "e\u0301", steps: [{ usage: 47, modifiers: 0 }, { usage: 8, modifiers: 0 }] }]), /Unapproved composition/);
  assert.throws(() => createProfile("invalid", "Invalid", [...frenchProfile.outputs], true,
    [{ glyph: "é", steps: [{ usage: 47, modifiers: 0 }, { usage: 8, modifiers: 0 }, { usage: 8, modifiers: 0 }] }]), /Unapproved composition/);
});

test("catalogue failures are isolated, zero coverage stays valid and result IDs survive reordering", async () => {
  const { computeCatalogue, targetRegistry, initialTarget, successfulResults } = await loaded;
  const data = source(group("14", 10));
  const normal = computeCatalogue(data);
  const reversed = computeCatalogue(data, [...targetRegistry].reverse());
  for (const entry of targetRegistry) assert.deepEqual(reversed[entry.id], normal[entry.id]);
  const failed = computeCatalogue(data, targetRegistry, (input, from, target) => {
    if (target.id.includes("colemak")) throw new Error("Bad profile fixture");
    return { ...normal.qwerty.result, profileId: target.id };
  });
  assert.equal(failed["colemak-dh"].status, "error");
  assert.equal(failed.azerty.status, "ready");
  assert.equal(successfulResults(failed).length, 4);
  assert.equal(initialTarget("colemak-dh", failed), "azerty");
  assert.equal(initialTarget("removed", failed), "azerty");
  const zero = computeCatalogue(source(group("7e40", 4)));
  assert.equal(zero.isrt.status, "ready");
  assert.equal(zero.isrt.result.supportedActionCount, 0);
  assert.equal(initialTarget("isrt", zero), "isrt");
  assert.equal(initialTarget("azerty", {}), null);
});

test("route ranking costs exactly the same resolved key participants used for accounting", async () => {
  const { frenchProfile, project } = await loaded;
  const target = { ...frenchProfile, glyphRoutes: new Map([["a", [
    { steps: [{ keyId: "hid-14", modifiers: [{ family: "Shift" }, { family: "Option" }] }], priority: 0 },
    { steps: [{ keyId: "hid-14", modifiers: [] }, { keyId: "hid-14", modifiers: [] }], priority: 1 },
  ]]]) };
  assert.equal(project(source(group("14", 5)), frenchProfile, target).estimatedUseCount, 10);
  const directTie = { ...target, glyphRoutes: new Map([["a", [
    ...target.glyphRoutes.get("a"), { steps: [{ keyId: "hid-14", modifiers: [{ family: "Shift" }] }], priority: 100 },
  ]]]) };
  const result = project(source(group("14", 5)), frenchProfile, directTie);
  assert.equal(result.keyUses["hid-14"], 5); // equal uses prefer one step, not the unmodified two-step route
  assert.equal(result.modifierUses.Shift, 5);
});
