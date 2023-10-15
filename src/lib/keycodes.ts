import { KeymapType } from "../service/models/keymap.js";

import * as QK from "./quantum.js";
import Custom from "./custom.js";

export function isModifier(kc: number): boolean {
  return (kc & 0xef) - 0xe0 >= 0;
}

export function isLayerMod(kc: number): boolean {
  return (kc & QK.QK_LAYER_MOD) !== 0 && kc <= QK.QK_LAYER_MOD_MAX;
}

export function isLayerTap(kc: number): boolean {
  return (kc & QK.QK_LAYER_TAP) !== 0 && kc <= QK.QK_LAYER_TAP_MAX;
}

export function isModTap(kc: number): boolean {
  return (kc & QK.QK_MOD_TAP) !== 0 && kc <= QK.QK_MOD_TAP_MAX;
}

export function getModifierFromModTap(kc: number): number {
  const m = kc & ~QK.QK_MOD_TAP;
  const s = m & ~QK.QK_BASIC_MAX;

  if ((s & QK.QK_LCTL) === QK.QK_LCTL) {
    return 0xe0;
  }
  if ((s & QK.QK_LSFT) === QK.QK_LSFT) {
    return 0xe1;
  }
  if ((s & QK.QK_LALT) === QK.QK_LALT) {
    return 0xe2;
  }
  if ((s & QK.QK_LGUI) === QK.QK_LGUI) {
    return 0xe3;
  }
  if ((s & QK.QK_RCTL) === QK.QK_RCTL) {
    return 0xe4;
  }
  if ((s & QK.QK_RSFT) === QK.QK_RSFT) {
    return 0xe5;
  }
  if ((s & QK.QK_RALT) === QK.QK_RALT) {
    return 0xe6;
  }
  if ((s & QK.QK_RGUI) === QK.QK_RGUI) {
    return 0xe7;
  }

  return 0;
}

export function getLayerFromLayerTap(kc: number): number {
  const upper = kc & ~QK.QK_BASIC_MAX;
  const layer = (upper & ~QK.QK_LAYER_TAP) >> 8;

  return layer;
}

export function modifierBitfieldToMaskedModifiers(mods: number): number {
  const modifierKeycodes = getModifiersFromModsBitfield(mods);

  return modifierKeycodes.reduce((acc, mod) => {
    switch (mod) {
      case 0xe0:
        return acc | QK.QK_LCTL;
      case 0xe1:
        return acc | QK.QK_LSFT;
      case 0xe2:
        return acc | QK.QK_LALT;
      case 0xe3:
        return acc | QK.QK_LGUI;
      case 0xe4:
        return acc | QK.QK_RCTL;
      case 0xe5:
        return acc | QK.QK_RSFT;
      case 0xe6:
        return acc | QK.QK_RALT;
      case 0xe7:
        return acc | QK.QK_RGUI;
      default:
        return acc;
    }
  }, 0);
}

/**
 * @returns {number[]}
 */
export function getModifiersFromModsBitfield(mods: number): number[] {
  const modifiers = [];

  if ((mods & 0x1) === 0x1) {
    modifiers.push(0xe0);
  }
  if ((mods & 0x2) === 0x2) {
    modifiers.push(0xe1);
  }
  if ((mods & 0x4) === 0x4) {
    modifiers.push(0xe2);
  }
  if ((mods & 0x8) === 0x8) {
    modifiers.push(0xe3);
  }
  if ((mods & 0x10) === 0x10) {
    modifiers.push(0xe4);
  }
  if ((mods & 0x20) === 0x20) {
    modifiers.push(0xe5);
  }
  if ((mods & 0x40) === 0x40) {
    modifiers.push(0xe6);
  }
  if ((mods & 0x80) === 0x80) {
    modifiers.push(0xe7);
  }

  return modifiers;
}

export function removeModifierFromBitfield(
  mods: number,
  modifier: number,
): number {
  // & 0x7 remove the 0xE- from the modifier code
  // we are left with a number from 0 to 7
  // pushing 1 left by that amount gives position of the modifier in
  // the bitfield
  const modifierBit = 1 << (modifier & 0x7);
  return mods & ~modifierBit;
}

export function getBasicFromModTap(kc: number): number {
  return kc & QK.QK_BASIC_MAX;
}

export function hasModifier(kc: number): boolean {
  return (
    (kc &
      (QK.QK_LALT |
        QK.QK_LCTL |
        QK.QK_LGUI |
        QK.QK_LSFT |
        QK.QK_RALT |
        QK.QK_RCTL |
        QK.QK_LGUI |
        QK.QK_LSFT)) !==
    0
  );
}

export function isCustomKeycode(kc: number): boolean {
  return Object.keys(Custom).includes(kc.toString(10));
}

export function getType(keycode: number): KeymapType {
  if (!hasModifier(keycode) && !isModTap(keycode) && !isLayerTap(keycode)) {
    return KeymapType.Plain;
  }
  if (isModTap(keycode) && !isLayerTap(keycode)) {
    return KeymapType.ModTap;
  }
  if (isLayerTap(keycode)) {
    return KeymapType.LayerTap;
  }
  if (isLayerMod(keycode)) {
    return KeymapType.LayerMod;
  }

  return KeymapType.Plain;
}

export function getEncodedKeycode(
  keycode: string,
): [string, KeymapType, string] {
  const kc = parseInt(keycode, 16);
  let base = (kc & 0xff).toString(16);
  const type = getType(kc);
  let alter: string = "";

  if (isCustomKeycode(kc)) {
    return [keycode, KeymapType.Plain, ""];
  }

  if (isModifier(kc)) {
    return ["", KeymapType.ModTap, keycode];
  }

  switch (type) {
    case KeymapType.ModTap:
      alter = getModifierFromModTap(kc).toString(16);
      break;

    case KeymapType.LayerTap:
      alter = getLayerFromLayerTap(kc).toString(16);
      break;

    case KeymapType.LayerMod:
      alter = base;
      break;

    default:
    case KeymapType.Plain:
      base = keycode;
      break;
  }

  return [base, type, alter];
}
