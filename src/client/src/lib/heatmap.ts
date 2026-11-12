export const KEY_WIDTH = 60;
// The original heatmap.js palette, shared by observed and projected views.
export const HEATMAP_GRADIENT = {
  0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1: "rgb(255,0,0)",
};
export const HEATMAP_LEGEND = "linear-gradient(to right, transparent, rgb(0,0,255) 25%, rgb(0,255,0) 55%, yellow 85%, rgb(255,0,0))";
export interface HeatPoint { x: number; y: number; value: number }
export interface HeatmapData { min: number; max: number; data: HeatPoint[] }
export interface ComparisonHeatmapScale {
  referenceTotal: number;
  maximum: number;
  mode: "linear" | "log";
}

export function matrixHeatmapPoints(matrix: number[][]): HeatPoint[] {
  return matrix.flatMap((row, r) => row?.map((value, c) => ({
    x: (c + 0.5) * KEY_WIDTH, y: (r + 0.5) * KEY_WIDTH, value,
  })) || []);
}

export function comparisonHeatmapScale(counts: readonly (readonly number[])[], referenceTotal: number,
  mode: ComparisonHeatmapScale["mode"]): ComparisonHeatmapScale {
  let maximum = 0;
  for (const layout of counts) for (const count of layout) maximum = Math.max(maximum, count);
  return { referenceTotal, maximum, mode };
}

const originalValue = (value: number, total: number) =>
  1 + Math.log((value > 0 ? value / total : 0.001) / 0.5 + 0.01);

// Preserve the original page's transfer function and per-layer normalization.
export function observedHeatmapData(matrix: number[][], total: number): HeatmapData {
  const data = matrixHeatmapPoints(matrix).map((point) => ({ ...point,
    value: total > 0 ? originalValue(point.value, total) : 0,
  }));
  if (total <= 0 || !data.length) return { min: 0, max: 1, data: [] };
  const values = data.map((point) => point.value);
  const min = Math.min(0, ...values), max = Math.max(0, ...values);
  return { min, max: max > min ? max : min + 1, data };
}

export function comparisonHeatmapData(points: HeatPoint[], normalization: ComparisonHeatmapScale): HeatmapData {
  const { referenceTotal: total, maximum, mode } = normalization;
  if (maximum <= 0 || total <= 0) return { min: 0, max: 1, data: [] };
  if (mode === "linear") return { min: 0, max: maximum, data: points.filter((point) => point.value > 0) };
  // All three comparison panels use the same reference total and count range.
  // Unlike the legacy page, don't clamp negative logarithmic maxima to zero or
  // paint zero-count positions: those choices flattened the observed heatmap.
  const min = 1 + Math.log(0.01);
  return { min, max: originalValue(maximum, total), data: points.filter((point) => point.value > 0)
    .map((point) => ({ ...point, value: originalValue(point.value, total) })) };
}
