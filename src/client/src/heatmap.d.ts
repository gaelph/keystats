declare module "heatmap.js" {
  export interface HeatmapInstance {
    setData(data: { min: number; max: number; data: { x: number; y: number; value: number }[] }): void;
    getDataURL(): string;
  }
  export function create(config: {
    container: HTMLElement; radius?: number; width?: number; height?: number;
    gradient?: Record<number, string>;
  }): HeatmapInstance;
}
