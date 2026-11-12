const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/client/src/state/projectionStore.ts");
const a = { keyboardId: 343, date: null };
const b = { keyboardId: 1, date: "2026-11-02" };
const response = (dataset, count = 1) => ({ ...dataset, sourceEventCount: count,
  groups: [{ keycode: "14", modifiers: 0, type: "plain", count }] });
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const results = (count = 0) => ({ azerty: { status: "ready", result: { estimatedUseCount: count } },
  qwerty: { status: "ready", result: { estimatedUseCount: count } } });

test("projection loading is lazy, deduplicated and cached across views/scales", async () => {
  const { createProjectionStore } = await loaded;
  const pending = deferred();
  let calls = 0, computations = 0;
  const store = createProjectionStore(() => { calls++; return pending.promise; }, () => { computations++; return results(); });
  assert.equal(store.getState().view, "observed");
  assert.equal(store.getState().activity, "all");
  assert.equal(store.getState().targetId, "azerty");
  assert.equal(calls, 0);
  const first = store.getState().load(a);
  const strictModeRepeat = store.getState().load(a);
  await Promise.resolve();
  assert.equal(calls, 1);
  pending.resolve(response(a));
  await Promise.all([first, strictModeRepeat]);
  assert.equal(store.getState().request.status, "ready");
  assert.equal(computations, 1);
  store.getState().setScale("log");
  store.getState().setView("observed");
  store.getState().setView("comparison");
  await store.getState().load(a);
  assert.equal(calls, 1);
  assert.equal(computations, 1);
});

test("activity toggles reuse a single snapshot and refresh both modes without resetting selection", async () => {
  const { createProjectionStore } = await loaded;
  let calls = 0;
  const store = createProjectionStore(async () => {
    const count = ++calls;
    return { ...response(a, count + 10), printing: { ...response(a, count), excludedEventCount: 10 } };
  }, (source) => results(source.sourceEventCount));
  store.getState().setActivity("printing");
  await store.getState().load(a);
  assert.equal(store.getState().activity, "printing");
  assert.equal(store.getState().request.results.azerty.result.estimatedUseCount, 11);
  assert.equal(store.getState().request.printingResults.azerty.result.estimatedUseCount, 1);
  store.getState().setActivity("all");
  store.getState().setActivity("printing");
  store.getState().setScale("linear");
  await store.getState().load(a);
  assert.equal(calls, 1);
  await store.getState().load(a, true);
  assert.equal(calls, 2);
  assert.equal(store.getState().activity, "printing");
  assert.equal(store.getState().request.results.azerty.result.estimatedUseCount, 12);
  assert.equal(store.getState().request.printingResults.azerty.result.estimatedUseCount, 2);
});

test("late responses cannot replace another selected dataset", async () => {
  const { createProjectionStore, datasetKey } = await loaded;
  const old = deferred(), latest = deferred();
  const store = createProjectionStore((dataset) => dataset.keyboardId === a.keyboardId ? old.promise : latest.promise, () => results());
  const first = store.getState().load(a);
  const second = store.getState().load(b);
  latest.resolve(response(b));
  await second;
  old.resolve(response(a));
  await first;
  assert.equal(store.getState().request.key, datasetKey(b));
});

test("forced refresh supersedes an older same-dataset response and cache", async () => {
  const { createProjectionStore } = await loaded;
  const old = deferred(), latest = deferred();
  let calls = 0;
  const store = createProjectionStore(() => ++calls === 1 ? old.promise : latest.promise, () => results());
  const first = store.getState().load(a);
  await Promise.resolve();
  const refresh = store.getState().load(a, true);
  latest.resolve(response(a, 2));
  await refresh;
  old.resolve(response(a, 1));
  await first;
  await store.getState().load(a);
  assert.equal(store.getState().request.source.sourceEventCount, 2);
  assert.equal(calls, 2);
});

test("failures are retryable and mismatched responses are errors", async () => {
  const { createProjectionStore } = await loaded;
  let calls = 0;
  const store = createProjectionStore(async () => { if (++calls === 1) throw new Error("Offline"); return response(a); }, () => results());
  await store.getState().load(a);
  assert.equal(store.getState().request.status, "error");
  assert.match(store.getState().request.message, /Offline/);
  await store.getState().load(a, true);
  assert.equal(store.getState().request.status, "ready");
  const wrong = createProjectionStore(async () => response(b), () => results());
  await wrong.getState().load(a);
  assert.equal(wrong.getState().request.status, "error");
});

test("target persistence is global, guarded, local and independent of snapshot/view controls", async () => {
  const { createProjectionStore } = await loaded;
  let saved = "qwerty", calls = 0;
  const storage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
  const store = createProjectionStore(async (dataset) => { calls++; return response(dataset); }, () => results(), { storage });
  await store.getState().load(a);
  assert.equal(store.getState().targetId, "qwerty");
  store.getState().setTarget("azerty");
  store.getState().setScale("linear");
  store.getState().setActivity("printing");
  store.getState().setView("observed"); store.getState().setView("comparison");
  assert.equal(calls, 1);
  assert.equal(saved, "azerty");
  store.getState().setTarget("qwerty");
  await store.getState().load(b);
  assert.equal(store.getState().targetId, "qwerty");
  assert.equal(store.getState().scale, "linear");
  assert.equal(store.getState().activity, "printing");
  const reopened = createProjectionStore(async () => response(a), () => results(), { storage });
  await reopened.getState().load(a);
  assert.equal(reopened.getState().targetId, "qwerty");
  const denied = { getItem() { throw new Error("Denied"); }, setItem() { throw new Error("Denied"); } };
  const privateStore = createProjectionStore(async () => response(a), () => results(), { storage: denied });
  await privateStore.getState().load(a);
  privateStore.getState().setTarget("qwerty");
  assert.equal(privateStore.getState().targetId, "qwerty");
});

test("invalid/disabled startup preferences fall back, while active refresh errors do not change target", async () => {
  const { createProjectionStore } = await loaded;
  for (const remembered of ["removed-layout", "isrt"]) {
    let saved = remembered, fail = false;
    const store = createProjectionStore(async () => response(a), () => ({ ...results(),
      isrt: { status: "unavailable", reason: "Unverified" },
      qwerty: fail ? { status: "error", reason: "Bad target" } : results().qwerty,
    }), { storage: { getItem: () => saved, setItem: (_, value) => { saved = value; } } });
    await store.getState().load(a);
    assert.equal(store.getState().targetId, "azerty");
    assert.equal(saved, "azerty");
    store.getState().setTarget("qwerty"); fail = true;
    await store.getState().load(a, true);
    assert.equal(store.getState().request.status, "ready");
    assert.equal(store.getState().targetId, "qwerty");
    assert.equal(store.getState().request.results.qwerty.status, "error");
    store.getState().setTarget("azerty"); store.getState().setTarget("qwerty");
    assert.equal(store.getState().targetId, "azerty", "Failed option cannot be newly selected");
  }
  const fallback = createProjectionStore(async () => response(a), () => ({ azerty: { status: "error", reason: "Broken" }, qwerty: results().qwerty }));
  await fallback.getState().load(a); assert.equal(fallback.getState().targetId, "qwerty");
  const empty = createProjectionStore(async () => response(a), () => ({}));
  await empty.getState().load(a); assert.equal(empty.getState().targetId, null);
});

test("a deliberate target choice during fetch survives its completion and preserves generation guards", async () => {
  const { createProjectionStore } = await loaded;
  const pending = deferred();
  const store = createProjectionStore(() => pending.promise, () => results());
  const loading = store.getState().load(a);
  store.getState().setTarget("qwerty");
  pending.resolve(response(a)); await loading;
  assert.equal(store.getState().targetId, "qwerty");
  assert.equal(store.getState().request.status, "ready");
});
