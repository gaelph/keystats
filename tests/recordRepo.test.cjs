const assert = require("node:assert/strict");
const path = require("node:path");
const { test } = require("node:test");
const { build } = require("esbuild");

test("available dates include all recorded days for the selected keyboard", async () => {
  // Replace the production database module so this test never opens user data.
  const { outputFiles } = await build({
    stdin: {
      contents: `
        export { default as RecordRepo } from "./src/service/repository/recordRepo.ts";
        export { default as db } from "./src/service/database.ts";
      `,
      resolveDir: path.resolve(__dirname, ".."),
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
    plugins: [{
      name: "in-memory-database",
      setup(builder) {
        builder.onLoad({ filter: /\/service\/database\.ts$/ }, () => ({
          contents: `
            import knex from "knex";
            export default knex({
              client: "sqlite3",
              connection: { filename: ":memory:" },
              useNullAsDefault: true,
            });
            export class DatabaseError extends Error {}
            export class NotFoundError extends DatabaseError {}
          `,
        }));
      },
    }],
  });
  const compiled = { exports: {} };
  new Function("require", "module", "exports", outputFiles[0].text)(
    require, compiled, compiled.exports,
  );
  const { RecordRepo, db } = compiled.exports;

  try {
    await db.schema.createTable("keymaps", (table) => {
      table.integer("id").primary();
      table.integer("keyboardId");
      table.string("keycode").defaultTo("14");
      table.string("type").defaultTo("plain");
      table.integer("layer").defaultTo(0);
      table.integer("row").defaultTo(1);
      table.integer("column").defaultTo(0);
    });
    await db.schema.createTable("records", (table) => {
      table.integer("keymapId");
      table.string("date");
      table.integer("counts").defaultTo(1);
      table.integer("modifiers").defaultTo(0);
    });
    await db("keymaps").insert([
      { id: 1, keyboardId: 343 },
      { id: 2, keyboardId: 343 },
      { id: 3, keyboardId: 1 },
    ]);
    const dates = Array.from({ length: 20 }, (_, i) =>
      `2026-11-${String(i + 1).padStart(2, "0")}`,
    );
    await db("records").insert([
      ...dates.slice().reverse().map((date) => ({ keymapId: 1, date })),
      { keymapId: 2, date: dates[19] },
      { keymapId: 3, date: "2025-12-31" },
    ]);

    const repo = new RecordRepo();
    assert.deepEqual(await repo.getAvailableDates(343), dates);
    assert.deepEqual(await repo.getAvailableDates(1), ["2025-12-31"]);
    assert.deepEqual(await repo.getAvailableDates(999), []);
    await db("records").insert([
      { keymapId: 1, date: "2026-1-02", counts: 2 },
      { keymapId: 1, date: "2026-01-02", counts: 3 },
      { keymapId: 1, date: "2026-10-02", counts: 4 },
      { keymapId: 3, date: "2026-1-02", counts: 100 },
    ]);
    const january = await repo.getTrendPositions(343, "2026-01-01", "2026-01-31");
    assert.equal(january.length, 1);
    assert.equal(january[0].date, "2026-01-02");
    assert.equal(january[0].count, 5);
  } finally {
    await db.destroy();
  }
});
