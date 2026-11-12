import type { DecodedAction, LayoutProfile, TargetRoute } from "./types.js";
import { resolveStep } from "./participation.js";

export type ProjectableAction = Extract<DecodedAction, { kind: "glyph" | "control" }>;

export function candidateRoutes(action: ProjectableAction, target: LayoutProfile): readonly TargetRoute[] {
  return (action.kind === "glyph" ? target.glyphRoutes.get(action.glyph) : target.controlRoutes.get(action.control)) || [];
}
export function selectRoute(action: ProjectableAction, target: LayoutProfile): TargetRoute | undefined {
  const candidates = candidateRoutes(action, target).filter((route) =>
    !(action.kind === "glyph" && action.shortcut && route.steps.length > 1));
  const ranked = candidates.map((route) => {
    const steps = route.steps.map((step) => resolveStep(step, action.modifiers, target));
    return { route, uses: steps.reduce((sum, step) => sum + step.uses, 0), modifiers: steps.reduce((sum, step) => sum + step.modifiers, 0) };
  });
  ranked.sort((a, b) => a.uses - b.uses || a.route.steps.length - b.route.steps.length || a.modifiers - b.modifiers ||
    a.route.priority - b.route.priority || JSON.stringify(a.route.steps).localeCompare(JSON.stringify(b.route.steps)));
  return ranked[0]?.route;
}
