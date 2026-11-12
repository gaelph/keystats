const assert = require("node:assert/strict");
const path = require("node:path");
const { test } = require("node:test");
const { build } = require("esbuild");
const loadTs = require("./loadTs.cjs");

test("repetition denominators count presses in each run, not just runs", async () => {
  const { repetitionPresses } = await loadTs("src/client/src/lib/repetitions.ts");
  assert.equal(repetitionPresses([0, 10, 3, 2]), 22);
  assert.equal(repetitionPresses([]), 0);
});

test("finger and hand increments atomically add runs without overwriting other buckets", async () => {
  const { outputFiles } = await build({
    stdin: { contents: `export {default as Finger} from './src/service/repository/fingerUsageRepo.ts';
      export {default as Hand} from './src/service/repository/handUsagerRepo.ts';
      export {default as db} from './src/service/database.ts';`, resolveDir: path.resolve(__dirname, "..") },
    bundle: true, platform: "node", format: "cjs", packages: "external", write: false,
    plugins: [{ name: "memory-db", setup(builder) {
      builder.onLoad({ filter: /\/service\/database\.ts$/ }, () => ({ contents: `
        import knex from 'knex';
        export default knex({client:'sqlite3', connection:{filename:':memory:'}, useNullAsDefault:true});
        export class DatabaseError extends Error {}
        export class NotFoundError extends DatabaseError {}` }));
    } }],
  });
  const compiled = { exports: {} };
  new Function("require", "module", "exports", outputFiles[0].text)(require, compiled, compiled.exports);
  const { Finger, Hand, db } = compiled.exports;
  try {
    for (const [table, field] of [["finger_usage", "finger"], ["hand_usage", "hand"]]) {
      await db.schema.createTable(table, (t) => {
        t.increments("id"); t.integer("keyboardId"); t.integer(field); t.integer("repeats");
        t.string("date"); t.integer("count"); t.timestamp("updatedAt");
        t.unique(["keyboardId", field, "repeats", "date"]);
      });
    }
    const finger = new Finger(), hand = new Hand();
    await Promise.all(Array.from({ length: 20 }, () => finger.incrementFingerUsage(1, 2, 2)));
    await Promise.all(Array.from({ length: 15 }, () => hand.incrementHandUsage(1, 0, 3)));
    await finger.incrementFingerUsage(1, 2, 1);
    await hand.incrementHandUsage(1, 1, 3);
    await finger.incrementFingerUsage(1, 2, 0);
    await hand.incrementHandUsage(1, 0, 0);
    assert.deepEqual((await db("finger_usage").orderBy("repeats")).map(({ repeats, count }) => [repeats, count]), [[1, 1], [2, 20]]);
    assert.deepEqual((await db("hand_usage").orderBy("hand")).map(({ hand, count }) => [hand, count]), [[0, 15], [1, 1]]);
  } finally { await db.destroy(); }
});
