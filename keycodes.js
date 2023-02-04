let codes = ["no", "rollover", "post_fail", "undefined"];
const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const punctuation = [
  "enter",
  "escape",
  "backspace",
  "tab",
  "space",
  "-",
  "=",
  "[",
  "]",
  "\\",
  "non-us #",
  ";",
  "'",
  "`",
  ",",
  ".",
  "/",
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

codes = [...codes, ...letters, ...numbers, ...punctuation];

const modifiers = {
  [0xe0]: "lctl",
  [0xe1]: "lsft",
  [0xe2]: "lalt",
  [0xe3]: "lcmd",
  [0xe4]: "rctl",
  [0xe5]: "rsft",
  [0xe6]: "ralt",
  [0xe7]: "rcmd",
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

const isLayerTap = is(QK_LAYER_TAP);
const getLayerTap = getLayer(QK_LAYER_TAP);
const isLayerMod = is(QK_LAYER_MOD);
const getLayerMod = getLayer(QK_LAYER_MOD);

module.exports = {
  keycodes: {
    qwerty: codes,
  },
  modifiers,
  isLayerTap,
  getLayerTap,
  isLayerMod,
  getLayerMod,
};
