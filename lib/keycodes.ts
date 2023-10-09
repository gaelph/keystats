// @ts-ignore
import * as KC from "../client/src/lib/keycodes.js";
import { KeymapType } from "../service/models/keymap.js";

export function getType(keycode: number): KeymapType {
  if (
    !KC.hasModifier(keycode) &&
    !KC.isModTap(keycode) &&
    !KC.isLayerTap(keycode)
  ) {
    return KeymapType.Plain;
  }
  if (KC.isModTap(keycode) && !KC.isLayerTap(keycode)) {
    return KeymapType.ModTap;
  }
  if (KC.isLayerTap(keycode)) {
    return KeymapType.LayerTap;
  }
  if (KC.isLayerMod(keycode)) {
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

  if (KC.isCustomKeycode(kc)) {
    return [keycode, KeymapType.Plain, ""];
  }

  if (KC.isModifier(kc)) {
    return ["", KeymapType.ModTap, keycode];
  }

  switch (type) {
    case KeymapType.ModTap:
      alter = KC.getModifierFromModTap(kc).toString(16);
      break;

    case KeymapType.LayerTap:
      alter = KC.getLayerFromLayerTap(kc).toString(16);
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
