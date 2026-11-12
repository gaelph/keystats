import type { PrintingProjection, ProjectionGroup, ProjectionPositionGroup, ProjectionSource } from "../dto/projection.js";
import type { LayoutProfile } from "./types.js";
export declare function isPrintingAction(group: ProjectionGroup, profile: LayoutProfile): boolean;
export declare function printingOnly(source: ProjectionSource, positions: readonly ProjectionPositionGroup[], profile: LayoutProfile): PrintingProjection;
//# sourceMappingURL=printing.d.ts.map