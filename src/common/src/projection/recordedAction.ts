import type { ProjectionGroup } from "../dto/projection.js";

// QMK QK_MODS (0x0100..0x1fff) embeds a five-bit modifier mask
// above the basic usage. Its 0x10 flag selects right-hand modifiers.
// Normalize at the legacy-data boundary; never mutate stored/grouped input.
export function normalizeRecordedAction(group: ProjectionGroup): { usage: number; modifiers: number } {
  const code = parseInt(group.keycode, 16);
  if (group.type === "plain" && code >= 0x0100 && code <= 0x1fff) {
    const mask = (code >> 8) & 0x1f;
    const embedded = mask & 0x10 ? (mask & 0xf) << 4 : mask & 0xf;
    return { usage: code & 0xff, modifiers: group.modifiers | embedded };
  }
  return { usage: code, modifiers: group.modifiers };
}
