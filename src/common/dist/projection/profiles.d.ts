import { type LayoutOutput, type LayoutProfile, type ModifierRequirement } from "./types.js";
export declare const profileProvenance: {
    os: string;
    method: string;
};
export declare const customGlyphAliases: ReadonlyMap<number, string>;
export declare function textModifiers(bits: number): ModifierRequirement[];
export interface LayoutRecipe {
    glyph: string;
    steps: {
        usage: number;
        modifiers: number;
    }[];
}
export declare const compositionCharacters: ReadonlySet<string>;
export declare function createProfile(id: string, name: string, outputs: LayoutOutput[], iso: boolean, recipes?: readonly LayoutRecipe[], angle?: boolean): LayoutProfile;
export declare const frenchProfile: LayoutProfile;
export declare function createNativeTarget(kind: "french" | "us"): LayoutProfile;
//# sourceMappingURL=profiles.d.ts.map