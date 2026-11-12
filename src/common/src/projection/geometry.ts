import { keyId, type Finger, type Hand, type KeyRow, type ReferenceKey } from "./types.js";

// Physical HID positions, not printed letters: AZERTY and QWERTY share these
// touch-typing assignments. Function/navigation keys have no fixed finger.
const fingerUsages: Record<Finger, readonly number[]> = {
  "left-pinkie": [53, 30, 43, 20, 57, 4, 225, 100, 29, 224],
  "left-ring": [31, 26, 22, 27],
  "left-middle": [32, 8, 7, 6],
  "left-index": [33, 34, 21, 23, 9, 10, 25, 5],
  "left-thumb": [44, 226, 227],
  "right-thumb": [230, 231],
  "right-index": [35, 36, 28, 24, 11, 13, 17, 16],
  "right-middle": [37, 12, 14, 54],
  "right-ring": [38, 18, 15, 55],
  "right-pinkie": [39, 45, 46, 42, 19, 47, 48, 49, 40, 51, 52, 56, 229],
};
const fingers = new Map<number | string, Finger>([["fn", "left-pinkie"]]);
for (const [finger, usages] of Object.entries(fingerUsages)) {
  for (const usage of usages) fingers.set(usage, finger as Finger);
}
fingers.set(41, "left-pinkie"); // Escape
const rows: Record<number, KeyRow> = { 0: "function", 1.05: "number", 2.1: "top",
  3.15: "home", 4.2: "bottom", 5.25: "thumb", 5.75: "navigation" };

// Geometry is reference policy, not inferred from the recording device.
export function compactApple(iso: boolean): ReferenceKey[] {
  const keys: ReferenceKey[] = [];
  function add(usage: number | string, label: string, x: number, y: number,
    width = 1, hand: Hand = "right", height = 1): ReferenceKey {
    const key: ReferenceKey = {
      id: typeof usage === "number" ? keyId(usage) : usage,
      label, x, y, width, height, hand,
      row: typeof usage === "number" && usage >= 79 && usage <= 82 ? "navigation" : rows[y],
      finger: fingers.get(usage),
    };
    keys.push(key);
    return key;
  }
  add(41, "Esc", 0, 0, 1.5, "left", 0.7);
  const functionLabels = ["Bright −", "Bright +", "Mission", "Spotlight", "Dictation", "DND",
    "Previous", "Play/pause", "Next", "Mute", "Vol −", "Vol +"];
  functionLabels.forEach((label, i) => add(58 + i, label, 1.5 + i * 1.125, 0, 1.125,
    i < 6 ? "left" : "right", 0.7));
  add(53, "", 0, 1.05, 1, "left");
  [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 45, 46].forEach((usage, i) =>
    add(usage, "", i + 1, 1.05, 1, i < 5 ? "left" : "right"));
  add(42, "Backspace", 13, 1.05, 2);
  add(43, "Tab", 0, 2.1, 1.5, "left");
  [20, 26, 8, 21, 23, 28, 24, 12, 18, 19, 47, 48].forEach((usage, i) =>
    add(usage, "", 1.5 + i, 2.1, 1, i < 5 ? "left" : "right"));
  if (!iso) add(49, "", 13.5, 2.1, 1.5);
  add(57, "Caps", 0, 3.15, 1.75, "left");
  [4, 22, 7, 9, 10, 11, 13, 14, 15, 51, 52].forEach((usage, i) =>
    add(usage, "", 1.75 + i, 3.15, 1, i < 5 ? "left" : "right"));
  if (iso) {
    add(49, "", 12.75, 3.15);
    add(40, "Enter", 13.5, 2.1, 1.5, "right", 2.05).isoEnter = true;
  } else add(40, "Enter", 12.75, 3.15, 2.25);
  add(225, "Shift", 0, 4.2, iso ? 1.25 : 2.25, "left").modifier = { family: "Shift", side: "left" };
  if (iso) add(100, "", 1.25, 4.2, 1, "left");
  [29, 27, 6, 25, 5, 17, 16, 54, 55, 56].forEach((usage, i) =>
    add(usage, "", 2.25 + i, 4.2, 1, i < 5 ? "left" : "right"));
  add(229, "Shift", 12.25, 4.2, 2.75).modifier = { family: "Shift", side: "right" };
  add("fn", "Fn", 0, 5.25, 1, "left").modifier = { family: "Fn" };
  add(224, "Control", 1, 5.25, 1, "left").modifier = { family: "Control", side: "left" };
  add(226, "Option", 2, 5.25, 1, "left").modifier = { family: "Option", side: "left" };
  add(227, "Cmd", 3, 5.25, 1.25, "left").modifier = { family: "Command", side: "left" };
  add(44, "Space", 4.25, 5.25, 5.5, "left");
  add(231, "Cmd", 9.75, 5.25, 1.25).modifier = { family: "Command", side: "right" };
  add(230, "Option", 11, 5.25).modifier = { family: "Option", side: "right" };
  add(80, "←", 12, 5.75, 1, "right", 0.5);
  add(81, "↓", 13, 5.75, 1, "right", 0.5);
  add(82, "↑", 13, 5.25, 1, "right", 0.5);
  add(79, "→", 14, 5.75, 1, "right", 0.5);
  return keys;
}
