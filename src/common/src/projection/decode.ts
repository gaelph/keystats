import type { ProjectionGroup } from "../dto/projection.js";
import { customGlyphAliases } from "./profiles.js";
import type { DecodedAction, LayoutProfile, ModifierRequirement } from "./types.js";
import { normalizeRecordedAction } from "./recordedAction.js";

const modifierBits: readonly ModifierRequirement[] = [
  { family: "Control", side: "left" }, { family: "Shift", side: "left" },
  { family: "Option", side: "left" }, { family: "Command", side: "left" },
  { family: "Control", side: "right" }, { family: "Shift", side: "right" },
  { family: "Option", side: "right" }, { family: "Command", side: "right" },
];
// Standard USB usages / QMK basic keycodes, independently checked against:
// https://github.com/qmk/qmk_firmware/blob/master/quantum/keycodes.h (version 0.0.9).
const controls = new Map<number, string>([
  [40, "Enter"], [41, "Escape"], [42, "Backspace"], [43, "Tab"], [57, "Caps Lock"],
  [74, "Home"], [75, "Page Up"], [76, "Delete"], [77, "End"], [78, "Page Down"],
  [79, "Right"], [80, "Left"], [81, "Down"], [82, "Up"], [88, "Enter"],
  [0x7f, "Mute"], [0x80, "Volume up"], [0x81, "Volume down"],
  [0xa8, "Mute"], [0xa9, "Volume up"], [0xaa, "Volume down"],
  [0xab, "Next"], [0xac, "Previous"], [0xae, "Play/pause"],
  [0xbd, "Brightness up"], [0xbe, "Brightness down"], [0xc1, "Mission Control"],
]);

export function decode(group: ProjectionGroup, source: LayoutProfile): DecodedAction {
  const { usage, modifiers: recordedModifiers } = normalizeRecordedAction(group);
  if (usage >= 0xe0 && usage <= 0xe7 && (group.type === "plain" || group.type === "mtap")) return { kind: "modifier-only" };
  if (group.type !== "plain") return { kind: "unresolved", reason: "source-action-unknown" };
  const modifiers = modifierBits.filter((_, i) => recordedModifiers & (1 << i));
  const control = controls.get(usage) || (usage >= 58 && usage <= 69 ? `F${usage - 57}` : undefined);
  if (control) return { kind: "control", control, modifiers };
  const shortcutModifiers = modifiers.filter((mod) => mod.family === "Command" || mod.family === "Control");
  const alias = customGlyphAliases.get(usage);
  if (alias) return {
    kind: "glyph", glyph: alias, modifiers: shortcutModifiers,
    shortcut: shortcutModifiers.length > 0, alias: true,
  };
  const textBits = ((recordedModifiers & 0x22) ? 2 : 0) | ((recordedModifiers & 0x44) ? 4 : 0);
  const output = source.outputs.find((entry) => entry.usage === usage && entry.modifiers === textBits);
  if (!output) return { kind: "unresolved", reason: "source-action-unknown" };
  if (output.dead) return { kind: "unresolved", reason: "source-dead-key" };
  return { kind: "glyph", glyph: output.glyph, modifiers: shortcutModifiers,
    shortcut: shortcutModifiers.length > 0, alias: false };
}
