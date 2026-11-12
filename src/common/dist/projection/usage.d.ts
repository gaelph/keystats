import type { Finger, Hand, KeyRow, LayoutProfile, ProjectionResult } from "./types.js";
import type { ObservedProjection } from "../dto/projection.js";
export interface KeyboardUsage {
    total: number;
    rows: Record<KeyRow | "unplaced", number>;
    hands: Record<Hand | "unplaced", number>;
    fingers: Record<Finger | "unassigned", number>;
}
export type ProjectedUsage = KeyboardUsage;
export declare function mergeObservedLayers(observed: ObservedProjection): {
    matrix: number[][];
    layer: {
        type: "plain" | "mtap" | "ltap" | "lmod" | "layer";
        keycode: string;
        character?: string | undefined;
    }[][][];
};
export declare function observedUsage(observed: ObservedProjection): KeyboardUsage;
export declare function projectedUsage(result: ProjectionResult, profile: LayoutProfile): ProjectedUsage;
//# sourceMappingURL=usage.d.ts.map