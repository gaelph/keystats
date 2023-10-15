import * as QK from "./quantum.js";
import * as Keycodes from "./keycodes.js";
import Modifiers from "./modifiers.js";
import Custom from "./custom.js";

import Azerty, {
  shifted as AzertyShifted,
  shiftAlted as AzertyShiftAlted,
  alted as AzertyAlted,
} from "./keyboard_layouts/azerty_mac.js";

function formatWithModifier(kc: number, result: string): string {
  const {
    QK_LCTL,
    QK_LSFT,
    QK_LALT,
    QK_LGUI,
    QK_RCTL,
    QK_RSFT,
    QK_RALT,
    QK_RGUI,
  } = QK;
  kc &= ~0x1000;
  const shift = (kc & QK_LSFT) !== 0 || (kc & QK_RSFT) !== 0;
  const alt = (kc & QK_LALT) !== 0 || (kc & QK_RALT) !== 0;
  const ctrl = (kc & QK_LCTL) !== 0 || (kc & QK_RCTL) !== 0;
  const gui = (kc & QK_LGUI) !== 0 || (kc & QK_RGUI) !== 0;

  if (!ctrl && !gui) {
    if (shift && !alt) {
      result = AzertyShifted[kc & 0xff] ?? `SHIFT ${result}`;
    } else if (shift && alt) {
      result = AzertyShiftAlted[kc & 0xff] ?? `SHIFT ALT ${result}`;
    } else {
      result = AzertyAlted[kc & 0xff] ?? `ALT ${result}`;
    }
  } else {
    if (alt) {
      result = `ALT ${result} `;
    }
    if (shift) {
      result = `SHIFT ${result} `;
    }
    if (gui) {
      result = `CMD ${result} `;
    }
    if (ctrl) {
      result = `CTRL ${result} `;
    }
  }

  return result;
}

function formatLayerMod(kc: number): string {
  const base = kc & QK.QK_BASIC_MAX;
  return `L(${base})`;
}

function formatModTap(kc: number): string {
  const base = kc & QK.QK_BASIC_MAX;
  return Azerty[base];
  // const modifier = getModifierFromModTap(kc) - 0xe0;
  // return `MT(${modifiers[modifier]}, ${azerty.normal[base]})`;
}

function formatLayerTap(kc: number): string {
  const base = kc & QK.QK_BASIC_MAX;
  return Azerty[base];
  // const upper = kc & ~QK.QK_BASIC_MAX;
  // const layer = (upper & ~QK.QK_LAYER_TAP) >> 8;
  // return `LT(${layer}, ${azerty.normal[base]})`;
}

function formatModifier(kc: number): string {
  return Modifiers[(kc & 0xef) - 0xe0];
}

function isCustomKey(kc: number): kc is keyof typeof Custom {
  return Object.prototype.hasOwnProperty.call(Custom, kc);
}

export function formatKeyCode(k: string): string {
  const base = parseInt(k, 16) & 0xff;
  const upper = parseInt(k, 16) >> 8;
  const kc = parseInt(k, 16);

  let result = Azerty[base];

  if (isCustomKey(kc)) {
    return Custom[kc];
  }

  if (upper === 0) {
    if (Keycodes.isModifier(base)) {
      result = formatModifier(kc);
    }
    return result;
  }

  if (Keycodes.isModifier(base)) {
    result = formatModifier(kc);
  }

  if (
    result &&
    Keycodes.hasModifier(kc) &&
    !Keycodes.isModTap(kc) &&
    !Keycodes.isLayerTap(kc)
  ) {
    result = formatWithModifier(kc, result);
    return result;
  }
  if (Keycodes.isModTap(kc) && !Keycodes.isLayerTap(kc)) {
    result = formatModTap(kc);
    return result;
  }
  if (Keycodes.isLayerTap(kc)) {
    result = formatLayerTap(kc);
    return result;
  }
  if (Keycodes.isLayerMod(kc)) {
    result = formatLayerMod(kc);
    return result;
  }

  return result;
}
