import type { LayoutProfile, ModifierRequirement, RouteStep } from "./types.js";
export declare function stepModifiers(required: readonly ModifierRequirement[], retained: readonly ModifierRequirement[]): ModifierRequirement[];
export declare function resolveStep(step: RouteStep, retained: readonly ModifierRequirement[], target: LayoutProfile): {
    keys: import("./types.js").ReferenceKey[];
    missing: string[];
    uses: number;
    modifiers: number;
};
//# sourceMappingURL=participation.d.ts.map