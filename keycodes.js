let codes = ["no", "rollover", "post_fail", "undefined"];
let shiftedCodes = ["S no", "S rollover", "S post_fail", "S undefined"];
let altedCodes = ["A no", "A rollover", "A post_fail", "A undefined"];
let shiftedAltCodes = ["SA no", "SA rollover", "SA post_fail", "SA undefined"];
const letters = [
  "q", // 0x04
  "b",
  "c",
  "d",
  "e",
  "f",
  "g", // 0x0a
  "h",
  "i",
  "j",
  "k",
  "l",
  ",", // 0x10
  "n",
  "o",
  "p",
  "a",
  "r",
  "s",
  "t",
  "u",
  "v",
  "z", // 0x1a
  "x",
  "y",
  "w",
];
const shiftedLetters = [
  "Q", // 0x04
  "B",
  "C",
  "D",
  "E",
  "F",
  "G", // 0x0a
  "H",
  "I",
  "J",
  "K",
  "L",
  "?", // 0x10
  "N",
  "O",
  "P",
  "A",
  "R",
  "S",
  "T",
  "U",
  "V",
  "Z", // 0x1a
  "X",
  "Y",
  "W",
];
const altedLetters = [
  "‡", // 0x04
  "ß",
  "©",
  "∂",
  "ê",
  "ƒ",
  "ﬁ", // 0x0a
  "Ì",
  "î",
  "Ï",
  "È",
  "¬",
  "∞", // 0x10
  "~ (dead)",
  "œ",
  "π",
  "æ",
  "®",
  "Ò",
  "†",
  "º",
  "◊",
  "Â", // 0x1a
  "≈",
  "Ú",
  "‹",
];
const shiftAltedLetters = [
  "Ω", //q 0x04
  "∫", // b
  "¢", // c
  "∆", // d
  "Ê", // e
  "·", // f
  "ﬂ", // g 0x0a
  "Î", // h
  "ï", // i
  "Í", // j
  "Ë", // k
  "|", // l
  "•", // ; 0x10
  "ı", // n
  "Œ", // o
  "∏", // p
  "Æ", // a
  "‚", // r
  "∑", // s
  "™", // t
  "ª", // u
  "√", // v
  "Å", // z 0x1a
  "⁄", // x
  "Ÿ", // y
  "›", // w
];
const numbers = [
  "&", // 0x1e
  "é",
  '"', // 0x20
  "'",
  "(",
  "6",
  "è",
  "!",
  "ç",
  "à",
];
const shiftedNumbers = [
  "1", // 0x1e
  "2",
  "3", // 0x20
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
];
const altedNumbers = [
  "", // 0x1e
  "ë",
  "“", // 0x20
  "‘",
  "{",
  "¶",
  "«",
  "¡",
  "Ç",
  "ø",
];
const shiftAltedNumbers = [
  "´ (dead)", // 0x1e
  "„",
  "”", // 0x20
  "’",
  "[",
  "å",
  "»",
  "Û",
  "Á",
  "Ø",
];
const punctuation = [
  "enter", // 0x28
  "escape",
  "backspace", // 0x2a
  "tab",
  "space", // 0x2c
  ")",
  "-",
  "^ (dead)",
  "$", // 0x30
  "` (dead)",
  "<",
  "m",
  "ù",
  "@",
  ";",
  ":",
  "=",
  "capslock",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "printscreen",
  "scrolllock",
  "pause",
  "insert",
  "home",
  "pageup",
  "delete",
  "end",
  "pagedown",
  "right",
  "left",
  "down",
  "up",
  "numlock",
];

const shiftedPunctuation = [
  "S enter", // 0x28
  "escape",
  "S backspace", // 0x2a
  "S tab",
  "S space", // 0x2c
  "°",
  "_",
  "¨ (dead)",
  "*", // 0x30
  "pound",
  ">",
  "M",
  "%",
  "#",
  ".",
  "/",
  "+",
  "S capslock",
  "S F1",
  "S F2",
  "S F3",
  "S F4",
  "S F5",
  "S F6",
  "S F7",
  "S F8",
  "S F9",
  "S F10",
  "S F11",
  "S F12",
  "S printscreen",
  "S scrolllock",
  "S pause",
  "S insert",
  "S home",
  "S pageup",
  "S delete",
  "S end",
  "S pagedown",
  "S right",
  "S left",
  "S down",
  "S up",
  "S numlock",
];
const altedPunctuation = [
  "A enter", // 0x28
  "A escape",
  "backspace", // 0x2a
  "A tab",
  "space", // 0x2c
  "]",
  "–",
  "ô",
  "€", // 0x30
  "@",
  "≤",
  "µ",
  "Ù",
  "•",
  "…",
  "÷",
  "≠",
  "A capslock",
  "A F1",
  "A F2",
  "A F3",
  "A F4",
  "A F5",
  "A F6",
  "A F7",
  "A F8",
  "A F9",
  "A F10",
  "A F11",
  "A F12",
  "A printscreen",
  "A scrolllock",
  "A pause",
  "A insert",
  "A home",
  "A pageup",
  "A delete",
  "A end",
  "A pagedown",
  "A right",
  "A left",
  "A down",
  "A up",
  "A numlock",
];
const shiftAltedPunctuation = [
  "SA enter", // 0x28
  "escape",
  "S backspace", // 0x2a
  "SA tab",
  "space", // 0x2c
  "}",
  "–",
  "Ô",
  "¥", // 0x30
  "#",
  "≥",
  "Ó",
  "‰",
  "Ÿ",
  "•",
  "\\",
  "±",
  "SA capslock",
  "SA F1",
  "SA F2",
  "SA F3",
  "SA F4",
  "SA F5",
  "SA F6",
  "SA F7",
  "SA F8",
  "SA F9",
  "SA F10",
  "SA F11",
  "SA F12",
  "SA printscreen",
  "SA scrolllock",
  "SA pause",
  "SA insert",
  "SA home",
  "SA pageup",
  "SA delete",
  "SA end",
  "SA pagedown",
  "SA right",
  "SA left",
  "SA down",
  "SA up",
  "SA numlock",
];
codes = [...codes, ...letters, ...numbers, ...punctuation];
shiftedCodes = [
  ...shiftedCodes,
  ...shiftedLetters,
  ...shiftedNumbers,
  ...shiftedPunctuation,
];
altedCodes = [
  ...altedCodes,
  ...altedLetters,
  ...altedNumbers,
  ...altedPunctuation,
];
shiftedAltCodes = [
  ...shiftedAltCodes,
  ...shiftAltedLetters,
  ...shiftAltedNumbers,
  ...shiftAltedPunctuation,
];

let specials = {
  [0x5db5]: "^",
  [0x5db6]: "`",
  [0x5db7]: "~",
  [0x5db8]: "’",
};

// quantum keycodes
const QK_BASIC = 0x0000;
const QK_BASIC_MAX = 0x00ff;
const QK_MODS = 0x0100;
const QK_LCTL = 0x0100;
const QK_LSFT = 0x0200;
const QK_LALT = 0x0400;
const QK_LGUI = 0x0800;
const QK_RMODS_MIN = 0x1000;
const QK_RCTL = 0x1100;
const QK_RSFT = 0x1200;
const QK_RALT = 0x1400;
const QK_RGUI = 0x1800;
const QK_MODS_MAX = 0x1fff;
const QK_FUNCTION = 0x2000;
const QK_FUNCTION_MAX = 0x2fff;
const QK_MACRO = 0x3000;
const QK_MACRO_MAX = 0x3fff;
const QK_LAYER_TAP = 0x4000;
const QK_LAYER_TAP_MAX = 0x4fff;
const QK_TO = 0x5000;
const QK_TO_MAX = 0x50ff;
const QK_MOMENTARY = 0x5100;
const QK_MOMENTARY_MAX = 0x51ff;
const QK_DEF_LAYER = 0x5200;
const QK_DEF_LAYER_MAX = 0x52ff;
const QK_TOGGLE_LAYER = 0x5300;
const QK_TOGGLE_LAYER_MAX = 0x53ff;
const QK_ONE_SHOT_LAYER = 0x5400;
const QK_ONE_SHOT_LAYER_MAX = 0x54ff;
const QK_ONE_SHOT_MOD = 0x5500;
const QK_ONE_SHOT_MOD_MAX = 0x55ff;
const QK_SWAP_HANDS = 0x5600;
const QK_SWAP_HANDS_MAX = 0x56ff;
const QK_TAP_DANCE = 0x5700;
const QK_TAP_DANCE_MAX = 0x57ff;
const QK_LAYER_TAP_TOGGLE = 0x5800;
const QK_LAYER_TAP_TOGGLE_MAX = 0x58ff;
const QK_LAYER_MOD = 0x5900;
const QK_LAYER_MOD_MAX = 0x59ff;
const QK_STENO = 0x5a00;
const QK_STENO_BOLT = 0x5a30;
const QK_STENO_GEMINI = 0x5a31;
const QK_STENO_COMB = 0x5a32;
const QK_STENO_COMB_MAX = 0x5a3c;
const QK_STENO_MAX = 0x5a3f;
const QK_MOD_TAP = 0x6000;
const QK_MOD_TAP_MAX = 0x7fff;
const QK_UNICODE = 0x8000;
const QK_UNICODE_MAX = 0xffff;
const QK_UNICODEMAP = 0x8000;
const QK_UNICODEMAP_MAX = 0xbfff;
const QK_UNICODEMAP_PAIR = 0xc000;
const QK_UNICODEMAP_PAIR_MAX = 0xffff;

const modifiers = {
  // [0xe0]: "lctl",
  // [0xe1]: "lshft",
  // [0xe2]: "lalt",
  // [0xe3]: "lcmd",
  // [0xe4]: "rctl",
  // [0xe5]: "rshft",
  // [0xe6]: "ralt",
  // [0xe7]: "rcmd",
  [QK_LCTL]: "lctrl",
  [QK_LSFT]: "lshft",
  [QK_LALT]: "lalt",
  [QK_LGUI]: "lcmd",
  [QK_RCTL]: "rctrl",
  [QK_RSFT]: "rshft",
  [QK_RALT]: "ralt",
  [QK_RGUI]: "rcmd",
};

function is(qkc) {
  return function (keycode) {
    return (keycode & qkc) == qkc;
  };
}
function getLayer(qkc) {
  return function (keycode) {
    const l = keycode & ~qkc;
    const layer = l >> 8;
    return layer;
  };
}
function getBasic(keycode) {
  return keycode & QK_BASIC_MAX;
}

const isLayerTap = is(QK_LAYER_TAP);
const getLayerTap = getLayer(QK_LAYER_TAP);
const isLayerMod = is(QK_LAYER_MOD);
const getLayerMod = getLayer(QK_LAYER_MOD);
const isModTap = is(QK_MOD_TAP);
const getModTap = getLayer(QK_MOD_TAP);

function getModifiers(modi) {
  modi = modi << 8;

  return Object.keys(modifiers).reduce(
    (acc, m) => {
      m = parseInt(m, 10);
      if ((modi & m) == m) {
        acc[modifiers[m]] = 1;
      }

      return acc;
    },
    {
      lctrl: 0,
      lalt: 0,
      lcmd: 0,
      lshft: 0,
      rctrl: 0,
      ralt: 0,
      rcmd: 0,
      rshft: 0,
    }
  );
}

function isShifted(modi) {
  modi = parseInt(modi, 16) << 8;
  return (modi & QK_LSFT) == QK_LSFT || (modi & QK_RSFT) == QK_RSFT;
}

function isAlted(modi) {
  modi = parseInt(modi, 16) << 8;
  return (modi & QK_LALT) == QK_LALT || (modi & QK_RALT) == QK_RALT;
}

function isCtrl(modi) {
  modi = parseInt(modi, 16) << 8;
  return (modi & QK_LCTL) == QK_LCTL || (modi & QK_RCTL) == QK_RCTL;
}

function isCmd(modi) {
  modi = parseInt(modi, 16) << 8;
  return (modi & QK_LGUI) == QK_LGUI || (modi & QK_RGUI) == QK_RGUI;
}

export default {
  keycodes: {
    azerty: codes,
    azertyShift: shiftedCodes,
    azertyAlt: altedCodes,
    azertyShiftAlt: shiftedAltCodes,
    specials,
  },
  modifiers,
  isLayerTap,
  getLayerTap,
  isLayerMod,
  getLayerMod,
  isModTap,
  getModTap,
  getBasic,
  getModifiers,
  isShifted,
  isAlted,
  isCtrl,
  isCmd,
};
