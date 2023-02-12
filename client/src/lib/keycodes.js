import * as QK from "./quantum_keycodes";
import * as azerty from "./azerty_mac";
import custom_keycodes from "./custom_keycodes";
// Qwerty
const normalKeycode = [
  "NO",
  "ROLL_OVER",
  "POST_FAIL",
  "UNDEFINED",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M", // 0x10
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "1",
  "2",
  "3", // 0x20
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "⏎",
  "ESC",
  "←",
  "⇥",
  "⎵",
  "-",
  "=",
  "[",
  "]", // 0x30
  "\\",
  "<",
  ";",
  "'",
  "`",
  ",",
  ".",
  "/",
  "⇪",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7", // 0x40
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "PRINT_SCREEN",
  "SCROLL_LOCK",
  "PAUSE",
  "INSERT",
  "HOME",
  "↥",
  "DEL",
  "END",
  "↧",
  "→",
  "←", // 0x50
  "↓",
  "↑",
  "NUM_LOCK",
  "KP_SLASH",
  "KP_ASTERISK",
  "KP_MINUS",
  "KP_PLUS",
  "KP_ENTER",
  "KP_1",
  "KP_2",
  "KP_3",
  "KP_4",
  "KP_5",
  "KP_6",
  "KP_7",
  "KP_8", // 0x60
  "KP_9",
  "KP_0",
  "KP_DOT",
  "NONUS_BACKSLASH",
  "APPLICATION",
  "KB_POWER",
  "KP_EQUAL",
  "F13",
  "F14",
  "F15",
  "F16",
  "F17",
  "F18",
  "F19",
  "F20",
  "F21", // 0x70
  "F22",
  "F23",
  "F24",
  "EXECUTE",
  "HELP",
  "MENU",
  "SELECT",
  "STOP",
  "AGAIN",
  "UNDO",
  "CUT",
  "COPY",
  "PASTE",
  "FIND",
  "KB_MUTE",
  "KB_VOLUME_UP", // 0x80
  "KB_VOLUME_DOWN",
  "LOCKING_CAPS_LOCK",
  "LOCKING_NUM_LOCK",
  "LOCKING_SCROLL_LOCK",
  "KP_COMMA",
  "KP_EQUAL_AS400",
  "INTERNATIONAL_1",
  "INTERNATIONAL_2",
  "INTERNATIONAL_3",
  "INTERNATIONAL_4",
  "INTERNATIONAL_5",
  "INTERNATIONAL_6",
  "INTERNATIONAL_7",
  "INTERNATIONAL_8",
  "INTERNATIONAL_9",
  "LANGUAGE_1", // 0x90
  "LANGUAGE_2",
  "LANGUAGE_3",
  "LANGUAGE_4",
  "LANGUAGE_5",
  "LANGUAGE_6",
  "LANGUAGE_7",
  "LANGUAGE_8",
  "LANGUAGE_9",
  "ALTERNATE_ERASE",
  "SYSTEM_REQUEST",
  "CANCEL",
  "CLEAR",
  "PRIOR",
  "RETURN",
  "SEPARATOR",
  "OUT", // 0xA0
  "OPER",
  "CLEAR_AGAIN",
  "CRSEL",
  "EXSEL",
];

const modifiers = ["CTRL", "⇑", "⌥", "CMD", "CTRL", "⇑", "⌥", "CMD"];

function isModifier(kc) {
  return (kc & 0xef) - 0xe0 >= 0;
}

function isLayerTap(kc) {
  return (kc & QK.QK_LAYER_TAP) !== 0 && kc <= QK.QK_LAYER_TAP_MAX;
}

function isModTap(kc) {
  return (kc & QK.QK_MOD_TAP) !== 0 && kc <= QK.QK_MOD_TAP_MAX;
}

function formatModifier(kc) {
  return modifiers[(kc & 0xef) - 0xe0];
}

function hasModifier(kc) {
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

function formatWithModifier(kc, result) {
  let shift = false;
  if ((kc & QK.QK_LSFT) !== 0 || (kc & QK.QK_RSFT) !== 0) {
    result = azerty.shifted[kc & 0xff] ?? `S(${result})`;
    shift = true;
  }
  if ((kc & QK.QK_LALT) !== 0 || (kc & QK.QK_RALT) !== 0) {
    if (shift) {
      result = azerty.shiftAlted[kc & 0xff] ?? `SA(${result})`;
    } else {
      result = azerty.alted[kc & 0xff] ?? `A(${result})`;
    }
  }
  if ((kc & QK.QK_LGUI) !== 0 || (kc & QK.QK_RGUI) !== 0) {
    result = `G(${result})`;
  }
  if ((kc & QK.QK_LCTL) !== 0 || (kc & QK.QK_RCTL) !== 0) {
    result = `C(${result})`;
  }

  return result;
}

function formatModTap(kc) {
  const base = kc & QK.QK_BASIC_MAX;
  return azerty.normal[base];
}
function formatLayerTap(kc) {
  const base = kc & QK.QK_BASIC_MAX;
  return azerty.normal[base];
}

export function formatKeyCode(k) {
  const base = parseInt(k, 16) & 0xff;
  const upper = parseInt(k, 16) >> 8;
  const kc = parseInt(k, 16);
  let result = azerty.normal[base];
  if (upper === 0) {
    if (isModifier(base)) {
      result = formatModifier(kc);
    }
    if (result === "") {
      result = custom_keycodes[kc];
    }
    return result;
  }

  if (custom_keycodes[kc]) {
    return custom_keycodes[kc];
  }

  if (isLayerTap(kc)) {
    result = formatLayerTap(kc);
    return result;
  }
  if (isModTap(kc)) {
    result = formatModTap(kc);
    return result;
  }

  if (base >= 0xe0 && base <= 0xef) {
    console.log("modifier", k);
  }

  if (isModifier(base)) {
    result = formatModifier(kc);
  }
  if (result && hasModifier(kc)) {
    result = formatWithModifier(kc, result);
  }

  return result;
}
