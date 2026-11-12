import { project } from "./project.js";
import type { ProjectionSource } from "../dto/projection.js";
import type { LayoutProfile, ProjectionResult } from "./types.js";
export type TargetId = "qwerty" | "azerty" | "colemak-dh" | "bepo" | "isrt";
export interface TargetMetadata {
    id: TargetId;
    label: string;
    reference: string;
    provenance: string;
    sourceUrl: string;
    notes: string;
}
export type TargetEntry = TargetMetadata & ({
    status: "available";
    profile: LayoutProfile;
} | {
    status: "unavailable";
    reason: string;
});
export type TargetOutcome = {
    status: "ready";
    result: ProjectionResult;
} | {
    status: "unavailable" | "error";
    reason: string;
};
export type TargetResults = Record<string, TargetOutcome>;
export declare const targetRegistry: readonly TargetEntry[];
export declare const defaultTargetId: TargetId;
export declare const targetProfiles: LayoutProfile[];
export declare const usProfile: LayoutProfile | undefined;
export declare function computeCatalogue(source: ProjectionSource, registry?: readonly TargetEntry[], compute?: typeof project): TargetResults;
export declare function successfulResults(results: TargetResults): ProjectionResult[];
export declare function initialTarget(remembered: string | null, results: TargetResults, registry?: readonly TargetEntry[]): TargetId | null;
//# sourceMappingURL=catalogue.d.ts.map