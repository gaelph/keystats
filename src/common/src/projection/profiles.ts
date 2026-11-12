import probe from "./profiles/generated-layouts.json";
import compositions from "./profiles/native-compositions.json";
import { compactApple } from "./geometry.js";
import { keyId, type LayoutOutput, type LayoutProfile, type ModifierRequirement, type TargetRoute } from "./types.js";

export const profileProvenance = { os: probe.os, method: probe.provenance };
export const customGlyphAliases: ReadonlyMap<number, string> = new Map([
  [0x7e4f, "^"], [0x7e50, "`"], [0x7e51, "~"], [0x7e52, "’"],
]);
export function textModifiers(bits: number): ModifierRequirement[] {
  return [
    ...((bits & 2) ? [{ family: "Shift" as const }] : []),
    ...((bits & 4) ? [{ family: "Option" as const }] : []),
  ];
}
export interface LayoutRecipe { glyph: string; steps: { usage: number; modifiers: number }[] }
const frenchLetters = "éèêëàâäîïôöùûüÿçœæ";
export const compositionCharacters: ReadonlySet<string> = new Set(frenchLetters + frenchLetters.toUpperCase());

export function createProfile(id: string, name: string, outputs: LayoutOutput[], iso: boolean,
  recipes: readonly LayoutRecipe[] = [], angle = false): LayoutProfile {
  const keys = compactApple(iso);
  if (angle) {
    const fingers = { "hid-1d": "left-ring", "hid-1b": "left-middle", "hid-6": "left-index" } as const;
    for (const key of keys) if (key.id in fingers) key.finger = fingers[key.id as keyof typeof fingers];
  }
  const glyphRoutes = new Map<string, TargetRoute[]>();
  const controlRoutes = new Map<string, TargetRoute[]>();
  const available = new Set(keys.map((key) => key.id));
  for (const key of keys) {
    const usage = Number.parseInt(key.id.slice(4), 16);
    if (!((usage >= 4 && usage <= 39) || (usage >= 45 && usage <= 56) || usage === 100)) continue;
    for (const modifiers of [0, 2]) {
      if (!outputs.some((output) => output.usage === usage && output.modifiers === modifiers && output.glyph.length > 0)) {
        throw new Error(`Unverified base/Shift definition: ${id}/${key.id}/${modifiers}`);
      }
    }
  }
  for (const output of outputs) {
    const position = keyId(output.usage === 50 ? 49 : output.usage);
    if (!available.has(position)) continue;
    if (output.dead && (!output.commitVerified || !["^", "`", "~"].includes(output.glyph))) continue;
    const route: TargetRoute = {
      priority: output.usage * 8 + output.modifiers,
      steps: [{ keyId: position, modifiers: textModifiers(output.modifiers) }],
    };
    if (output.dead) {
      route.steps = [...route.steps, { keyId: keyId(44), modifiers: [] }];
      route.recipe = "literal-dead-key-commit";
    }
    const routes = glyphRoutes.get(output.glyph) || [];
    routes.push(route);
    glyphRoutes.set(output.glyph, routes);
  }
  for (const [i, recipe] of recipes.entries()) {
    if (!compositionCharacters.has(recipe.glyph) || recipe.steps.length !== 2) throw new Error(`Unapproved composition: ${id}/${recipe.glyph}`);
    const steps = recipe.steps.map((step) => {
      const position = keyId(step.usage === 50 ? 49 : step.usage);
      if (!available.has(position) || ![0, 2, 4, 6].includes(step.modifiers)) throw new Error(`Invalid composition step: ${id}/${position}`);
      return { keyId: position, modifiers: textModifiers(step.modifiers) };
    });
    if (!outputs.some((o) => o.usage === recipe.steps[0].usage && o.modifiers === recipe.steps[0].modifiers && o.dead) ||
      !outputs.some((o) => o.usage === recipe.steps[1].usage && o.modifiers === recipe.steps[1].modifiers && !o.dead)) {
      throw new Error(`Composition requires one dead key then a base key: ${id}/${recipe.glyph}`);
    }
    const routes = glyphRoutes.get(recipe.glyph) || [];
    routes.push({ steps, recipe: "dead-key-composition", priority: 100000 + i });
    glyphRoutes.set(recipe.glyph, routes);
  }
  function control(action: string, usage: number, fn = false) {
    controlRoutes.set(action, [{ priority: usage, steps: [{ keyId: keyId(usage), modifiers: fn ? [{ family: "Fn" }] : [] }] }]);
  }
  [["Enter", 40], ["Escape", 41], ["Backspace", 42], ["Tab", 43], ["Caps Lock", 57],
    ["Right", 79], ["Left", 80], ["Down", 81], ["Up", 82]].forEach(([action, usage]) => control(String(action), Number(usage)));
  [["Delete", 42], ["Home", 80], ["End", 79], ["Page Up", 82], ["Page Down", 81]]
    .forEach(([action, usage]) => control(String(action), Number(usage), true));
  const media = ["Brightness down", "Brightness up", "Mission Control", "Spotlight", "Dictation", "Do Not Disturb",
    "Previous", "Play/pause", "Next", "Mute", "Volume down", "Volume up"];
  media.forEach((action, i) => { control(action, 58 + i); control(`F${i + 1}`, 58 + i, true); });
  for (const key of keys) {
    if (key.label) continue;
    const usage = parseInt(key.id.slice(4), 16);
    const base = outputs.find((output) => output.usage === usage && output.modifiers === 0);
    if (!base) throw new Error(`Missing key legend: ${id}/${key.id}`);
    key.label = base.glyph.length === 1 && /[a-z]/.test(base.glyph) ? base.glyph.toUpperCase() : base.glyph;
  }
  return { id, name, keys, outputs, glyphRoutes, controlRoutes };
}
// Source decoding must not depend on any optional target composition table.
export const frenchProfile = createProfile("macos-french-iso-v1", "French AZERTY · ISO", probe.french.outputs, true);
export function createNativeTarget(kind: "french" | "us"): LayoutProfile {
  return createProfile(kind === "french" ? "macos-french-iso-v1" : "macos-us-ansi-v1",
    kind === "french" ? "French AZERTY · ISO" : "US QWERTY · ANSI", probe[kind].outputs,
    kind === "french", compositions[kind].recipes);
}
