import type { ProjectionSource } from "../dto/projection.js";
import { decode } from "./decode.js";
import { candidateRoutes, selectRoute } from "./routes.js";
import { resolveStep } from "./participation.js";
import { modifierFamilies, type LayoutProfile, type ProjectionResult } from "./types.js";

export function project(source: ProjectionSource, sourceProfile: LayoutProfile, target: LayoutProfile): ProjectionResult {
  const result: ProjectionResult = {
    profileId: target.id, sourceEventCount: source.sourceEventCount,
    sourceModifierCount: 0, baseActionCount: 0, supportedActionCount: 0, unmappedActionCount: 0,
    estimatedUseCount: 0, recipeActionCount: 0, compositionActionCount: 0, aliasActionCount: 0,
    keyUses: {}, contributions: {}, unplacedModifiers: {}, unmapped: [],
    modifierUses: { Shift: 0, Option: 0, Command: 0, Control: 0, Fn: 0 },
  };
  for (const key of target.keys) { result.keyUses[key.id] = 0; result.contributions[key.id] = []; }
  for (const group of source.groups) {
    if (group.count === 0) continue;
    const action = decode(group, sourceProfile);
    if (action.kind === "modifier-only") { result.sourceModifierCount += group.count; continue; }
    result.baseActionCount += group.count;
    const actionLabel = action.kind === "glyph" ? `${action.modifiers.map((mod) => mod.family).join("+")}${action.shortcut ? "+" : ""}${JSON.stringify(action.glyph)}`
      : action.kind === "control" ? [...action.modifiers.map((mod) => mod.family), action.control].join("+") : `0x${group.keycode} (${group.type})`;
    const route = action.kind === "unresolved" ? undefined : selectRoute(action, target);
    if (action.kind === "unresolved" || !route) {
      const reason = action.kind === "unresolved" ? action.reason :
        action.kind === "glyph" && action.shortcut && candidateRoutes(action, target).some((candidate) => candidate.steps.length > 1)
          ? "shortcut-needs-composition" : "target-output-unsupported";
      result.unmapped.push({ source: group, action: actionLabel, reason });
      result.unmappedActionCount += group.count;
      continue;
    }
    result.supportedActionCount += group.count;
    if (action.kind === "glyph" && action.alias) result.aliasActionCount += group.count;
    if (route.recipe) result.recipeActionCount += group.count;
    if (route.recipe === "dead-key-composition") result.compositionActionCount += group.count;
    for (const step of route.steps) {
      const { keys: participants, missing } = resolveStep(step, action.modifiers, target);
      const description = participants.map((key) => key.modifier
        ? `${key.modifier.side || ""} ${key.modifier.family}`.trim() : key.label).join(" + ") +
        (route.recipe === "literal-dead-key-commit" ? " · literal dead-key + Space recipe" : route.recipe ? " · verified dead-key composition" : "");
      for (const key of participants) {
        result.keyUses[key.id] += group.count;
        result.estimatedUseCount += group.count;
        if (key.modifier) result.modifierUses[key.modifier.family] += group.count;
        const contribution = result.contributions[key.id].find((entry) => entry.action === actionLabel && entry.route === description);
        if (contribution) contribution.count += group.count;
        else result.contributions[key.id].push({ action: actionLabel, route: description, count: group.count });
      }
      for (const label of missing) {
        result.unplacedModifiers[label] = (result.unplacedModifiers[label] || 0) + group.count;
        const family = modifierFamilies.find((entry) => label.endsWith(entry))!;
        result.modifierUses[family] += group.count;
        result.estimatedUseCount += group.count;
      }
    }
  }
  if (result.sourceModifierCount + result.baseActionCount !== source.sourceEventCount ||
    result.supportedActionCount + result.unmappedActionCount !== result.baseActionCount ||
    !Number.isSafeInteger(result.estimatedUseCount)) throw new Error("Projection accounting does not reconcile");
  for (const entries of Object.values(result.contributions)) entries.sort((a, b) => b.count - a.count);
  result.unmapped.sort((a, b) => b.source.count - a.source.count);
  return result;
}
