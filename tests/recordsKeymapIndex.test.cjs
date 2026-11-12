const assert = require("node:assert/strict");
const { test } = require("node:test");
const knex = require("knex");
const migration = require("../migrations/20261102110000_add-records-keymap-index.js");

test("records keymap index supports lookups without changing data and rolls back", async () => {
  const db = knex({
    client: "sqlite3",
    connection: { filename: ":memory:" },
    useNullAsDefault: true,
  });

  try {
    await db.schema.createTable("records", (table) => {
      table.increments("id");
      table.integer("keymapId").notNullable();
      table.integer("counts").notNullable();
    });
    await db("records").insert([
      { keymapId: 1, counts: 10 },
      { keymapId: 1, counts: 20 },
      { keymapId: 2, counts: 30 },
    ]);
    const original = await db("records").orderBy("id");

    await migration.up(db);
    const indexes = await db.raw("PRAGMA index_list('records')");
    assert.equal(indexes.find((index) => index.name === "records_keymapid_index").unique, 0);
    const columns = await db.raw("PRAGMA index_info('records_keymapid_index')");
    assert.deepEqual(columns.map((column) => column.name), ["keymapId"]);
    const plan = await db.raw(
      "EXPLAIN QUERY PLAN SELECT * FROM records WHERE keymapId = ?",
      [1],
    );
    assert.ok(plan.some((step) => step.detail.includes("records_keymapid_index")));
    assert.deepEqual(await db("records").orderBy("id"), original);

    await migration.down(db);
    const remaining = await db.raw("PRAGMA index_list('records')");
    assert.ok(!remaining.some((index) => index.name === "records_keymapid_index"));
    assert.deepEqual(await db("records").orderBy("id"), original);
  } finally {
    await db.destroy();
  }
});
