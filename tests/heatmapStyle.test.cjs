const assert = require("node:assert/strict");
const { test } = require("node:test");
const loadTs = require("./loadTs.cjs");
const loaded = loadTs("src/client/src/lib/heatmap.ts");

test("observed heatmaps preserve the original palette, positions and transfer function", async () => {
  const { observedHeatmapData, HEATMAP_GRADIENT, KEY_WIDTH } = await loaded;
  assert.equal(KEY_WIDTH, 60);
  assert.deepEqual(HEATMAP_GRADIENT, { .25: "rgb(0,0,255)", .55: "rgb(0,255,0)", .85: "yellow", 1: "rgb(255,0,0)" });
  const matrix = [[1, 100, 0], [0, 300, 20]], total = 5000;
  const expected = matrix.flatMap((row, r) => row.map((value, c) => ({
    x: (c + 1) * 60 - 30, y: (r + 1) * 60 - 30,
    value: 1 + Math.log((value > 0 ? value / total : .001) / .5 + .01),
  })));
  assert.deepEqual(observedHeatmapData(matrix, total), {
    min: Math.min(0, ...expected.map((point) => point.value)),
    max: Math.max(0, ...expected.map((point) => point.value)), data: expected,
  });
});

test("all three comparison heatmaps share the source-inclusive range and identical count intensities", async () => {
  const { comparisonHeatmapData, comparisonHeatmapScale, matrixHeatmapPoints } = await loaded;
  for (const mode of ["linear", "log"]) {
    const scale = comparisonHeatmapScale([[200, 20, 0], [100, 20], [90, 20]], 10000, mode);
    assert.equal(scale.maximum, 200); // Actual coordinate can exceed every projected key
    const layouts = [
      matrixHeatmapPoints([[200, 20, 0]]),
      [{ x: 30, y: 30, value: 100 }, { x: 90, y: 30, value: 20 }],
      [{ x: 30, y: 30, value: 90 }, { x: 90, y: 30, value: 20 }],
    ].map((points) => comparisonHeatmapData(points, scale));
    for (const layout of layouts) {
      assert.equal(layout.min, layouts[0].min);
      assert.equal(layout.max, layouts[0].max);
      assert.equal(layout.data[1].value, layouts[0].data[1].value);
      assert.equal(layout.data.length, 2); // No phantom color on zero-count source keys
    }
    assert.equal(layouts[0].data[0].value, layouts[0].max);
    const intensity = (layouts[0].data[1].value - layouts[0].min) / (layouts[0].max - layouts[0].min);
    const expected = mode === "linear" ? 20 / 200 : Math.log1p(200 * 20 / 10000) / Math.log1p(200 * 200 / 10000);
    assert.ok(Math.abs(intensity - expected) < 1e-12);
  }
});

test("comparison log scale does not flatten low-frequency datasets by clamping its maximum to zero", async () => {
  const { comparisonHeatmapData, comparisonHeatmapScale, matrixHeatmapPoints, observedHeatmapData } = await loaded;
  const scale = comparisonHeatmapScale([[200, 20, 0], [100], [90]], 10000, "log");
  const current = comparisonHeatmapData(matrixHeatmapPoints([[200, 20, 0]]), scale);
  const legacy = observedHeatmapData([[200, 20, 0]], 10000);
  assert.ok(current.max < 0);
  assert.equal(legacy.max, 0);
  assert.ok((current.data[1].value - current.min) / (current.max - current.min) >
    (legacy.data[1].value - legacy.min) / (legacy.max - legacy.min));
});

test("comparison empty and single-key scales remain safe in both modes", async () => {
  const { comparisonHeatmapData, comparisonHeatmapScale } = await loaded;
  for (const mode of ["linear", "log"]) {
    const empty = comparisonHeatmapScale([[], [0], [0]], 0, mode);
    assert.deepEqual(comparisonHeatmapData([], empty), { min: 0, max: 1, data: [] });
    const one = comparisonHeatmapData([{ x: 30, y: 30, value: 1 }], comparisonHeatmapScale([[1], [], []], 1, mode));
    assert.ok(one.max > one.min);
    assert.equal(one.data[0].value, one.max);
  }
});
