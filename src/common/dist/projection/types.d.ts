import type { ProjectionGroup } from "../dto/projection.js";
export type Hand = "left" | "right";
export type Finger = "left-pinkie" | "left-ring" | "left-middle" | "left-index" | "left-thumb" | "right-thumb" | "right-index" | "right-middle" | "right-ring" | "right-pinkie";
export type KeyRow = "function" | "number" | "top" | "home" | "bottom" | "thumb" | "navigation";
export type ModifierFamily = "Shift" | "Option" | "Command" | "Control" | "Fn";
export interface ModifierRequirement {
    family: ModifierFamily;
    side?: Hand;
}
export interface ReferenceKey {
    id: string;
    label: string;
    hand: Hand;
    row: KeyRow;
    finger?: Finger;
    x: number;
    y: number;
    width: number;
    height: number;
    isoEnter?: boolean;
    modifier?: ModifierRequirement;
}
export interface LayoutOutput {
    usage: number;
    modifiers: number;
    glyph: string;
    dead: boolean;
    commitVerified: boolean;
}
export interface RouteStep {
    keyId: string;
    modifiers: readonly ModifierRequirement[];
}
export interface TargetRoute {
    steps: readonly RouteStep[];
    recipe?: "literal-dead-key-commit" | "dead-key-composition";
    priority: number;
}
export interface LayoutProfile {
    id: string;
    name: string;
    keys: readonly ReferenceKey[];
    outputs: readonly LayoutOutput[];
    glyphRoutes: ReadonlyMap<string, readonly TargetRoute[]>;
    controlRoutes: ReadonlyMap<string, readonly TargetRoute[]>;
}
export type UnmappedReason = "source-dead-key" | "source-action-unknown" | "target-output-unsupported" | "shortcut-needs-composition";
export type DecodedAction = {
    kind: "modifier-only";
} | {
    kind: "unresolved";
    reason: UnmappedReason;
} | {
    kind: "glyph";
    glyph: string;
    modifiers: readonly ModifierRequirement[];
    shortcut: boolean;
    alias: boolean;
} | {
    kind: "control";
    control: string;
    modifiers: readonly ModifierRequirement[];
};
export interface UnmappedAction {
    source: ProjectionGroup;
    action: string;
    reason: UnmappedReason;
}
export interface KeyContribution {
    action: string;
    route: string;
    count: number;
}
export interface ProjectionResult {
    profileId: string;
    sourceEventCount: number;
    sourceModifierCount: number;
    baseActionCount: number;
    supportedActionCount: number;
    unmappedActionCount: number;
    estimatedUseCount: number;
    recipeActionCount: number;
    compositionActionCount: number;
    aliasActionCount: number;
    keyUses: Record<string, number>;
    modifierUses: Record<ModifierFamily, number>;
    unplacedModifiers: Record<string, number>;
    contributions: Record<string, KeyContribution[]>;
    unmapped: UnmappedAction[];
}
export declare const keyId: (usage: number) => string;
export declare const modifierFamilies: readonly ModifierFamily[];
//# sourceMappingURL=types.d.ts.map