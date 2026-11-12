import type { LayoutProfile, ModifierRequirement, RouteStep } from "./types.js";

export function stepModifiers(required: readonly ModifierRequirement[], retained: readonly ModifierRequirement[]): ModifierRequirement[] {
  const normalize = (mod: ModifierRequirement): ModifierRequirement =>
    mod.family === "Shift" || mod.family === "Option" ? { family: mod.family } : mod;
  const result = retained.map(normalize);
  for (const mod of required.map(normalize)) {
    if (!result.some((existing) => existing.family === mod.family)) result.push(mod);
  }
  return result.filter((mod, i) => result.findIndex((other) => other.family === mod.family && other.side === mod.side) === i);
}

// Cost selection and accounting must resolve exactly the same participants.
export function resolveStep(step: RouteStep, retained: readonly ModifierRequirement[], target: LayoutProfile) {
  const base = target.keys.find((key) => key.id === step.keyId);
  if (!base) throw new Error(`Invalid profile route: ${target.id}/${step.keyId}`);
  const participants = new Map([[base.id, base]]);
  const missing = new Set<string>();
  for (const mod of stepModifiers(step.modifiers, retained)) {
    const side = mod.family === "Shift" || mod.family === "Option"
      ? base.hand === "left" ? "right" : "left" : mod.side;
    const key = target.keys.find((entry) => entry.modifier?.family === mod.family && (!side || entry.modifier.side === side));
    if (key) participants.set(key.id, key);
    else missing.add(`${mod.side || side || "unassigned"} ${mod.family}`);
  }
  const keys = [...participants.values()];
  return { keys, missing: [...missing], uses: keys.length + missing.size,
    modifiers: keys.filter((key) => key.modifier).length + missing.size };
}
