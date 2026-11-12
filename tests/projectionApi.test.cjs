const assert = require("node:assert/strict");
const { test } = require("node:test");
const express = require("express");
const loadTs = require("./loadTs.cjs");

test("projection API groups without data loss, isolates keyboard/day and rejects invalid queries", async () => {
  const { db, RecordRepo, projectionRouter, keyboardRouter } = await loadTs("tests/fixtures/projection.ts", [{
    name: "isolated-test-database",
    setup(builder) {
      builder.onLoad({ filter: /\/service\/database\.ts$/ }, () => ({ contents: `
        import knex from "knex";
        export default knex({ client: "sqlite3", connection: { filename: ":memory:" }, useNullAsDefault: true });
        export class DatabaseError extends Error {}
        export class NotFoundError extends DatabaseError {}
      ` }));
    },
  }]);
  let server;
  try {
    await db.schema.createTable("keyboards", (table) => {
      table.integer("id").primary(); table.string("name"); table.integer("vendorId"); table.integer("productId");
    });
    await db.schema.createTable("keymaps", (table) => {
      table.integer("id").primary(); table.integer("keyboardId"); table.string("keycode"); table.string("type");
      table.integer("layer"); table.integer("row"); table.integer("column");
    });
    await db.schema.createTable("keys", (table) => {
      table.integer("keyboardId"); table.integer("row"); table.integer("column");
      table.integer("hand"); table.integer("finger");
      table.primary(["keyboardId", "row", "column"]);
    });
    await db.schema.createTable("records", (table) => {
      table.integer("keymapId"); table.string("date"); table.integer("modifiers"); table.integer("counts");
      table.index(["keymapId"]);
    });
    await db("keyboards").insert([{ id: 343, name: "Technik", vendorId: 1, productId: 1 }, { id: 1, name: "Plaid", vendorId: 2, productId: 2 }]);
    await db("keys").insert([
      { keyboardId: 343, row: 0, column: 0, hand: 0, finger: 4 },
      { keyboardId: 343, row: 0, column: 1, hand: 1, finger: 6 },
      { keyboardId: 343, row: 1, column: 0, hand: 0, finger: 0 },
      { keyboardId: 343, row: 1, column: 1, hand: 1, finger: 9 },
      { keyboardId: 1, row: 0, column: 0, hand: 1, finger: 7 },
    ]);
    await db("keymaps").insert([
      { id: 1, keyboardId: 343, keycode: "0014", type: "plain", layer: 0, row: 0, column: 0 },
      { id: 2, keyboardId: 343, keycode: "14", type: "plain", layer: 0, row: 0, column: 1 },
      { id: 3, keyboardId: 343, keycode: "E1", type: "mtap", layer: 0, row: 1, column: 0 },
      { id: 4, keyboardId: 1, keycode: "14", type: "plain", layer: 0, row: 0, column: 0 },
      { id: 5, keyboardId: 343, keycode: "14", type: "ltap", layer: 2, row: 1, column: 1 },
    ]);
    await db("records").insert([
      { keymapId: 1, date: "2026-02-03", modifiers: 0, counts: 5 },
      { keymapId: 2, date: "2026-2-03", modifiers: 0, counts: 7 },
      { keymapId: 1, date: "2026-02-04", modifiers: 0, counts: 11 },
      { keymapId: 3, date: "2026-02-03", modifiers: 0, counts: 2 },
      { keymapId: 4, date: "2026-02-03", modifiers: 0, counts: 99 },
      { keymapId: 5, date: "2026-02-03", modifiers: 0, counts: 3 },
    ]);
    const repo = new RecordRepo();
    assert.deepEqual(await repo.getProjectionGroups(343, "2026-02-03"), [
      { keycode: "14", modifiers: 0, type: "ltap", count: 3 },
      { keycode: "14", modifiers: 0, type: "plain", count: 12 },
      { keycode: "e1", modifiers: 0, type: "mtap", count: 2 },
    ]);
    const app = express();
    app.use("/api/keyboards", keyboardRouter);
    app.use("/broken/:keyboardId", projectionRouter(
      { getProjectionData: async () => { throw new Error("Database unavailable"); } },
      { getById: async () => ({ id: 343 }) },
    ));
    app.use((error, req, res, _next) => res.status(500).json({ error: error.message }));
    server = await new Promise((resolve) => { const instance = app.listen(0, "127.0.0.1", () => resolve(instance)); });
    const origin = `http://127.0.0.1:${server.address().port}`;
    const get = (suffix) => fetch(origin + suffix, { signal: AbortSignal.timeout(5000) });
    const base = "/api/keyboards/343/projection-source";
    const all = await get(base);
    assert.equal(all.status, 200);
    const allBody = await all.json();
    assert.equal(allBody.sourceEventCount, 28);
    const day = await (await get(base + "?date=2026-02-03")).json();
    assert.equal(day.sourceEventCount, 17);
    assert.equal(day.date, "2026-02-03");
    assert.deepEqual(day.observed.keymapUsage, [[[5, 7], [2]], [], [[], [0, 3]]]);
    assert.equal(day.observed.totalKeypresses, day.sourceEventCount);
    assert.equal(day.printing.sourceEventCount, 12);
    assert.equal(day.printing.excludedEventCount, 5);
    assert.equal(day.printing.modifierParticipationCount, 0);
    assert.equal(day.printing.observed.totalKeypresses, 12);
    assert.deepEqual(day.printing.observed.keymapUsage, [[[5, 7]]]);
    assert.equal(allBody.printing.sourceEventCount, 23);
    assert.equal(day.observed.keymaps[0][0][0][0].character, "a");
    assert.deepEqual(day.observed.keymaps[1], []);
    assert.deepEqual(day.observed.physicalKeys, [
      { row: 0, column: 0, hand: 0, finger: 4 }, { row: 0, column: 1, hand: 1, finger: 6 },
      { row: 1, column: 0, hand: 0, finger: 0 }, { row: 1, column: 1, hand: 1, finger: 9 },
    ]);
    const { observedUsage } = await loadTs("src/common/src/projection/usage.ts");
    const usage = observedUsage(day.observed);
    assert.equal(usage.total, 17);
    assert.equal(usage.hands.left, 7);
    assert.equal(usage.hands.right, 10);
    assert.equal(usage.fingers["left-thumb"], 5);
    assert.equal(usage.fingers["right-pinkie"], 3);
    const allUsage = observedUsage(allBody.observed);
    assert.deepEqual(await repo.getHandUsage(343), [
      { hand: 0, count: allUsage.hands.left }, { hand: 1, count: allUsage.hands.right },
    ]);
    assert.equal((await (await get("/api/keyboards/1/projection-source")).json()).sourceEventCount, 99);
    const empty = await (await get(base + "?date=2026-02-05")).json();
    assert.deepEqual(empty.groups, []);
    assert.equal(empty.printing.observed.totalKeypresses, 0);
    for (const suffix of ["?date=2026-02-30", "?date=2026-2-03", "?period=all", "?date=2026-02-03&date=2026-02-04"]) {
      assert.equal((await get(base + suffix)).status, 400, suffix);
    }
    assert.equal((await get("/api/keyboards/343junk/projection-source")).status, 400);
    assert.equal((await get("/api/keyboards/-1/projection-source")).status, 400);
    assert.equal((await get("/api/keyboards/999/projection-source")).status, 404);
    assert.equal((await get("/broken/343")).status, 500);
    assert.equal((await db("records").count("* AS count").first()).count, 6);
  } finally {
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    await db.destroy();
  }
});
