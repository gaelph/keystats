import type { DecodedAction, LayoutProfile, TargetRoute } from "./types.js";
export type ProjectableAction = Extract<DecodedAction, {
    kind: "glyph" | "control";
}>;
export declare function candidateRoutes(action: ProjectableAction, target: LayoutProfile): readonly TargetRoute[];
export declare function selectRoute(action: ProjectableAction, target: LayoutProfile): TargetRoute | undefined;
//# sourceMappingURL=routes.d.ts.map