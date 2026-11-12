const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/common/src/projection/index.ts");
const group = (keycode, count, modifiers = 0, type = "plain") => ({ keycode, count, modifiers, type });
const source = (...groups) => ({ keyboardId: 343, date: null, groups,
  sourceEventCount: groups.reduce((sum, item) => sum + item.count, 0) });
const sum = (counts) => Object.values(counts).reduce((a, b) => a + b, 0);

test("reference assignments cover physical typing positions independently of printed legends", async () => {
  const { targetProfiles } = await loaded;
  for (const profile of targetProfiles) {
    const keys = new Map(profile.keys.map((key) => [key.id, key]));
    for (const key of keys.values()) {
      assert.ok(key.row, `${profile.id}/${key.id} must have a row`);
      if (key.finger) assert.ok(key.finger.startsWith(key.hand + "-"), `${key.id} finger/hand must agree`);
    }
    for (const [id, row, finger] of [
      ["hid-14", "top", "left-pinkie"], ["hid-4", "home", "left-pinkie"],
      ["hid-5", "bottom", "left-index"], ["hid-11", "bottom", "right-index"],
      ["hid-23", "number", "right-index"], ["hid-2c", "thumb", "left-thumb"],
      ["hid-e3", "thumb", "left-thumb"], ["hid-e6", "thumb", "right-thumb"],
      ["hid-e1", "bottom", "left-pinkie"], ["hid-e5", "bottom", "right-pinkie"],
      ["hid-e0", "thumb", "left-pinkie"], ["fn", "thumb", "left-pinkie"],
      ["hid-3a", "function", undefined], ["hid-52", "navigation", undefined],
      ["hid-29", "function", "left-pinkie"],
    ]) {
      assert.equal(keys.get(id).row, row, `${profile.id}/${id} row`);
      assert.equal(keys.get(id).finger, finger, `${profile.id}/${id} finger`);
    }
    assert.equal(keys.get("hid-31").row, profile.id.includes("iso") ? "home" : "top");
    if (profile.id.includes("iso")) assert.equal(keys.get("hid-64").finger, "left-pinkie");
  }
});

test("usage follows target routes and includes target modifiers and dead-key commit Space", async () => {
  const { frenchProfile: fr, usProfile: us, project, projectedUsage } = await loaded;
  const input = source(group("14", 100), group("7e4f", 10), group("2c", 5), group("e1", 10, 0, "mtap"));
  const french = projectedUsage(project(input, fr, fr), fr);
  const american = projectedUsage(project(input, fr, us), us);
  assert.equal(french.total, 125);
  assert.equal(american.total, 125);
  assert.equal(french.rows.top, 110);
  assert.equal(french.rows.home, 0);
  assert.equal(french.rows.thumb, 15);
  assert.equal(american.rows.home, 100);
  assert.equal(american.rows.number, 10);
  assert.equal(american.rows.bottom, 10); // generated Shift, not a source repetition
  assert.equal(american.rows.thumb, 5);
  assert.equal(french.fingers["left-pinkie"], 100);
  assert.equal(french.fingers["right-pinkie"], 10);
  assert.equal(french.fingers["left-thumb"], 15);
  assert.equal(american.fingers["left-pinkie"], 110);
  assert.equal(american.fingers["right-index"], 10);
  assert.equal(american.fingers["left-thumb"], 5);
  assert.equal(100 * american.rows.home / american.total, 80);
  assert.deepEqual(american.hands, { left: 115, right: 10, unplaced: 0 });
  for (const usage of [french, american]) {
    for (const distribution of [usage.rows, usage.hands, usage.fingers]) assert.equal(sum(distribution), usage.total);
  }
});

test("unplaced and non-touch-typing uses stay visible in the percentage denominator", async () => {
  const { frenchProfile: fr, usProfile: us, project, projectedUsage } = await loaded;
  const result = project(source(group("14", 6, 0x10), group("3a", 2), group("50", 3)), fr, us);
  const before = JSON.stringify(result);
  const usage = projectedUsage(result, us);
  assert.equal(usage.total, 19); // A6 + unavailable right Control6 + F1/Fn4 + Left3
  assert.equal(usage.rows.unplaced, 6);
  assert.equal(usage.hands.unplaced, 6);
  assert.equal(usage.rows.function, 2);
  assert.equal(usage.rows.navigation, 3);
  assert.equal(usage.fingers["left-pinkie"], 8); // A + Fn
  assert.equal(usage.fingers.unassigned, 11); // unavailable6 + function2 + arrows3
  for (const distribution of [usage.rows, usage.hands, usage.fingers]) assert.equal(sum(distribution), usage.total);
  assert.equal(JSON.stringify(result), before);
});

test("empty, modifier-only and unsupported inputs have finite zero distributions", async () => {
  const { frenchProfile: fr, project, projectedUsage } = await loaded;
  for (const input of [source(), source(group("e1", 3, 0, "mtap")), source(group("7e40", 7))]) {
    const usage = projectedUsage(project(input, fr, fr), fr);
    assert.equal(usage.total, 0);
    for (const distribution of [usage.rows, usage.hands, usage.fingers]) {
      assert.ok(Object.values(distribution).every((count) => count === 0));
    }
  }
});
