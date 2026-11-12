// src/projection/types.ts
var keyId = (usage) => `hid-${usage.toString(16)}`;
var modifierFamilies = ["Shift", "Option", "Command", "Control", "Fn"];

// src/projection/profiles/generated-layouts.json
var generated_layouts_default = {
  french: {
    inputSourceID: "com.apple.keylayout.French",
    keyboardType: 41,
    outputs: [
      {
        commitVerified: false,
        dead: false,
        glyph: "q",
        modifiers: 0,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "Q",
        modifiers: 2,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2021",
        modifiers: 4,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u03A9",
        modifiers: 6,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "b",
        modifiers: 0,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "B",
        modifiers: 2,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xDF",
        modifiers: 4,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u222B",
        modifiers: 6,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "c",
        modifiers: 0,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "C",
        modifiers: 2,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA9",
        modifiers: 4,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA2",
        modifiers: 6,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "d",
        modifiers: 0,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "D",
        modifiers: 2,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2202",
        modifiers: 4,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2206",
        modifiers: 6,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "e",
        modifiers: 0,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "E",
        modifiers: 2,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xEA",
        modifiers: 4,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCA",
        modifiers: 6,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "f",
        modifiers: 0,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "F",
        modifiers: 2,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0192",
        modifiers: 4,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB7",
        modifiers: 6,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "g",
        modifiers: 0,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "G",
        modifiers: 2,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\uFB01",
        modifiers: 4,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\uFB02",
        modifiers: 6,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "h",
        modifiers: 0,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "H",
        modifiers: 2,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCC",
        modifiers: 4,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCE",
        modifiers: 6,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "i",
        modifiers: 0,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "I",
        modifiers: 2,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xEE",
        modifiers: 4,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xEF",
        modifiers: 6,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "j",
        modifiers: 0,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "J",
        modifiers: 2,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCF",
        modifiers: 4,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCD",
        modifiers: 6,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "k",
        modifiers: 0,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "K",
        modifiers: 2,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC8",
        modifiers: 4,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCB",
        modifiers: 6,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "l",
        modifiers: 0,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "L",
        modifiers: 2,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAC",
        modifiers: 4,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "|",
        modifiers: 6,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ",",
        modifiers: 0,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "?",
        modifiers: 2,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u221E",
        modifiers: 4,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBF",
        modifiers: 6,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "n",
        modifiers: 0,
        usage: 17
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "N",
        modifiers: 2,
        usage: 17
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "~",
        modifiers: 4,
        usage: 17
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0131",
        modifiers: 6,
        usage: 17
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "o",
        modifiers: 0,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "O",
        modifiers: 2,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0153",
        modifiers: 4,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0152",
        modifiers: 6,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "p",
        modifiers: 0,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "P",
        modifiers: 2,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u03C0",
        modifiers: 4,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u220F",
        modifiers: 6,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "a",
        modifiers: 0,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "A",
        modifiers: 2,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE6",
        modifiers: 4,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC6",
        modifiers: 6,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "r",
        modifiers: 0,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "R",
        modifiers: 2,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAE",
        modifiers: 4,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201A",
        modifiers: 6,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "s",
        modifiers: 0,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "S",
        modifiers: 2,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD2",
        modifiers: 4,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2211",
        modifiers: 6,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "t",
        modifiers: 0,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "T",
        modifiers: 2,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2020",
        modifiers: 4,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2122",
        modifiers: 6,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "u",
        modifiers: 0,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "U",
        modifiers: 2,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBA",
        modifiers: 4,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAA",
        modifiers: 6,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "v",
        modifiers: 0,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "V",
        modifiers: 2,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u25CA",
        modifiers: 4,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u221A",
        modifiers: 6,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "z",
        modifiers: 0,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "Z",
        modifiers: 2,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC2",
        modifiers: 4,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC5",
        modifiers: 6,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "x",
        modifiers: 0,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "X",
        modifiers: 2,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2248",
        modifiers: 4,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2044",
        modifiers: 6,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "y",
        modifiers: 0,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "Y",
        modifiers: 2,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xDA",
        modifiers: 4,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0178",
        modifiers: 6,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "w",
        modifiers: 0,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "W",
        modifiers: 2,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2039",
        modifiers: 4,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u203A",
        modifiers: 6,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "&",
        modifiers: 0,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 2,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\uF8FF",
        modifiers: 4,
        usage: 30
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "\xB4",
        modifiers: 6,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE9",
        modifiers: 0,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 2,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xEB",
        modifiers: 4,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201E",
        modifiers: 6,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: '"',
        modifiers: 0,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 2,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201C",
        modifiers: 4,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201D",
        modifiers: 6,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "'",
        modifiers: 0,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 2,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2018",
        modifiers: 4,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2019",
        modifiers: 6,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "(",
        modifiers: 0,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 2,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "{",
        modifiers: 4,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "[",
        modifiers: 6,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA7",
        modifiers: 0,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 2,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB6",
        modifiers: 4,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE5",
        modifiers: 6,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE8",
        modifiers: 0,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 2,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAB",
        modifiers: 4,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBB",
        modifiers: 6,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "!",
        modifiers: 0,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 2,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA1",
        modifiers: 4,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xDB",
        modifiers: 6,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE7",
        modifiers: 0,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 2,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC7",
        modifiers: 4,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC1",
        modifiers: 6,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE0",
        modifiers: 0,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 2,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xF8",
        modifiers: 4,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD8",
        modifiers: 6,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: " ",
        modifiers: 0,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: " ",
        modifiers: 2,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA0",
        modifiers: 4,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA0",
        modifiers: 6,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ")",
        modifiers: 0,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB0",
        modifiers: 2,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "}",
        modifiers: 4,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "]",
        modifiers: 6,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 0,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "_",
        modifiers: 2,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2014",
        modifiers: 4,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2013",
        modifiers: 6,
        usage: 46
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "^",
        modifiers: 0,
        usage: 47
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "\xA8",
        modifiers: 2,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xF4",
        modifiers: 4,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD4",
        modifiers: 6,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "$",
        modifiers: 0,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 2,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u20AC",
        modifiers: 4,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA5",
        modifiers: 6,
        usage: 48
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "`",
        modifiers: 0,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA3",
        modifiers: 2,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "@",
        modifiers: 4,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "#",
        modifiers: 6,
        usage: 49
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "`",
        modifiers: 0,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA3",
        modifiers: 2,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "@",
        modifiers: 4,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "#",
        modifiers: 6,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "m",
        modifiers: 0,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "M",
        modifiers: 2,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB5",
        modifiers: 4,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD3",
        modifiers: 6,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xF9",
        modifiers: 0,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "%",
        modifiers: 2,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD9",
        modifiers: 4,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2030",
        modifiers: 6,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "@",
        modifiers: 0,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "#",
        modifiers: 2,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2022",
        modifiers: 4,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0178",
        modifiers: 6,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ";",
        modifiers: 0,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 2,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2026",
        modifiers: 4,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2022",
        modifiers: 6,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ":",
        modifiers: 0,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 2,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xF7",
        modifiers: 4,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\\",
        modifiers: 6,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 0,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 2,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2260",
        modifiers: 4,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB1",
        modifiers: 6,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 0,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 2,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 4,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 6,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 0,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 2,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 4,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 6,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 0,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 2,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 4,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 6,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 0,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 2,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 4,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 6,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 0,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 2,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 4,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 6,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 0,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 2,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 4,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 6,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 0,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 2,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 4,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 6,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 0,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 2,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 4,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 6,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 0,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 2,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 4,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 6,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 0,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 2,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 4,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 6,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 0,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 2,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 4,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 6,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 0,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 2,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 4,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 6,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 0,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 2,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 4,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 6,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 0,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 2,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 4,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 6,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ",",
        modifiers: 0,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 2,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ",",
        modifiers: 4,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 6,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "<",
        modifiers: 0,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ">",
        modifiers: 2,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2264",
        modifiers: 4,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2265",
        modifiers: 6,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 0,
        usage: 103
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 2,
        usage: 103
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 4,
        usage: 103
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 6,
        usage: 103
      }
    ]
  },
  os: "Version 27.2 (Build 26B118)",
  provenance: "UCKeyTranslate, key-down, dead-key state reset per probe; dead glyph verified by unmodified Space",
  us: {
    inputSourceID: "com.apple.keylayout.US",
    keyboardType: 40,
    outputs: [
      {
        commitVerified: false,
        dead: false,
        glyph: "a",
        modifiers: 0,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "A",
        modifiers: 2,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE5",
        modifiers: 4,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC5",
        modifiers: 6,
        usage: 4
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "b",
        modifiers: 0,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "B",
        modifiers: 2,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u222B",
        modifiers: 4,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0131",
        modifiers: 6,
        usage: 5
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "c",
        modifiers: 0,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "C",
        modifiers: 2,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE7",
        modifiers: 4,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC7",
        modifiers: 6,
        usage: 6
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "d",
        modifiers: 0,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "D",
        modifiers: 2,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2202",
        modifiers: 4,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCE",
        modifiers: 6,
        usage: 7
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "e",
        modifiers: 0,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "E",
        modifiers: 2,
        usage: 8
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "\xB4",
        modifiers: 4,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB4",
        modifiers: 6,
        usage: 8
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "f",
        modifiers: 0,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "F",
        modifiers: 2,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0192",
        modifiers: 4,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCF",
        modifiers: 6,
        usage: 9
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "g",
        modifiers: 0,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "G",
        modifiers: 2,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA9",
        modifiers: 4,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02DD",
        modifiers: 6,
        usage: 10
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "h",
        modifiers: 0,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "H",
        modifiers: 2,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02D9",
        modifiers: 4,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD3",
        modifiers: 6,
        usage: 11
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "i",
        modifiers: 0,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "I",
        modifiers: 2,
        usage: 12
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "\u02C6",
        modifiers: 4,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02C6",
        modifiers: 6,
        usage: 12
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "j",
        modifiers: 0,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "J",
        modifiers: 2,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2206",
        modifiers: 4,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD4",
        modifiers: 6,
        usage: 13
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "k",
        modifiers: 0,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "K",
        modifiers: 2,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02DA",
        modifiers: 4,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\uF8FF",
        modifiers: 6,
        usage: 14
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "l",
        modifiers: 0,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "L",
        modifiers: 2,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAC",
        modifiers: 4,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD2",
        modifiers: 6,
        usage: 15
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "m",
        modifiers: 0,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "M",
        modifiers: 2,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB5",
        modifiers: 4,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC2",
        modifiers: 6,
        usage: 16
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "n",
        modifiers: 0,
        usage: 17
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "N",
        modifiers: 2,
        usage: 17
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "\u02DC",
        modifiers: 4,
        usage: 17
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02DC",
        modifiers: 6,
        usage: 17
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "o",
        modifiers: 0,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "O",
        modifiers: 2,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xF8",
        modifiers: 4,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xD8",
        modifiers: 6,
        usage: 18
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "p",
        modifiers: 0,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "P",
        modifiers: 2,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u03C0",
        modifiers: 4,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u220F",
        modifiers: 6,
        usage: 19
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "q",
        modifiers: 0,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "Q",
        modifiers: 2,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0153",
        modifiers: 4,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u0152",
        modifiers: 6,
        usage: 20
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "r",
        modifiers: 0,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "R",
        modifiers: 2,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAE",
        modifiers: 4,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2030",
        modifiers: 6,
        usage: 21
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "s",
        modifiers: 0,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "S",
        modifiers: 2,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xDF",
        modifiers: 4,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xCD",
        modifiers: 6,
        usage: 22
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "t",
        modifiers: 0,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "T",
        modifiers: 2,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2020",
        modifiers: 4,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02C7",
        modifiers: 6,
        usage: 23
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "u",
        modifiers: 0,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "U",
        modifiers: 2,
        usage: 24
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "\xA8",
        modifiers: 4,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA8",
        modifiers: 6,
        usage: 24
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "v",
        modifiers: 0,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "V",
        modifiers: 2,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u221A",
        modifiers: 4,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u25CA",
        modifiers: 6,
        usage: 25
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "w",
        modifiers: 0,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "W",
        modifiers: 2,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2211",
        modifiers: 4,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201E",
        modifiers: 6,
        usage: 26
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "x",
        modifiers: 0,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "X",
        modifiers: 2,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2248",
        modifiers: 4,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02DB",
        modifiers: 6,
        usage: 27
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "y",
        modifiers: 0,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "Y",
        modifiers: 2,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA5",
        modifiers: 4,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC1",
        modifiers: 6,
        usage: 28
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "z",
        modifiers: 0,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "Z",
        modifiers: 2,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u03A9",
        modifiers: 4,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB8",
        modifiers: 6,
        usage: 29
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 0,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "!",
        modifiers: 2,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA1",
        modifiers: 4,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2044",
        modifiers: 6,
        usage: 30
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 0,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "@",
        modifiers: 2,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2122",
        modifiers: 4,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u20AC",
        modifiers: 6,
        usage: 31
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 0,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "#",
        modifiers: 2,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA3",
        modifiers: 4,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2039",
        modifiers: 6,
        usage: 32
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 0,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "$",
        modifiers: 2,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA2",
        modifiers: 4,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u203A",
        modifiers: 6,
        usage: 33
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 0,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "%",
        modifiers: 2,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u221E",
        modifiers: 4,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\uFB01",
        modifiers: 6,
        usage: 34
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 0,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "^",
        modifiers: 2,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA7",
        modifiers: 4,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\uFB02",
        modifiers: 6,
        usage: 35
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 0,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "&",
        modifiers: 2,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB6",
        modifiers: 4,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2021",
        modifiers: 6,
        usage: 36
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 0,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 2,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2022",
        modifiers: 4,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB0",
        modifiers: 6,
        usage: 37
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 0,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "(",
        modifiers: 2,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAA",
        modifiers: 4,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB7",
        modifiers: 6,
        usage: 38
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 0,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ")",
        modifiers: 2,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBA",
        modifiers: 4,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201A",
        modifiers: 6,
        usage: 39
      },
      {
        commitVerified: false,
        dead: false,
        glyph: " ",
        modifiers: 0,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: " ",
        modifiers: 2,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA0",
        modifiers: 4,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA0",
        modifiers: 6,
        usage: 44
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 0,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "_",
        modifiers: 2,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2013",
        modifiers: 4,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2014",
        modifiers: 6,
        usage: 45
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 0,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 2,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2260",
        modifiers: 4,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB1",
        modifiers: 6,
        usage: 46
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "[",
        modifiers: 0,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "{",
        modifiers: 2,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201C",
        modifiers: 4,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u201D",
        modifiers: 6,
        usage: 47
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "]",
        modifiers: 0,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "}",
        modifiers: 2,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2018",
        modifiers: 4,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2019",
        modifiers: 6,
        usage: 48
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\\",
        modifiers: 0,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "|",
        modifiers: 2,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAB",
        modifiers: 4,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBB",
        modifiers: 6,
        usage: 49
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\\",
        modifiers: 0,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "|",
        modifiers: 2,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAB",
        modifiers: 4,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBB",
        modifiers: 6,
        usage: 50
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ";",
        modifiers: 0,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ":",
        modifiers: 2,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2026",
        modifiers: 4,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xDA",
        modifiers: 6,
        usage: 51
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "'",
        modifiers: 0,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: '"',
        modifiers: 2,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xE6",
        modifiers: 4,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xC6",
        modifiers: 6,
        usage: 52
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "`",
        modifiers: 0,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "~",
        modifiers: 2,
        usage: 53
      },
      {
        commitVerified: true,
        dead: true,
        glyph: "`",
        modifiers: 4,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "`",
        modifiers: 6,
        usage: 53
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ",",
        modifiers: 0,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "<",
        modifiers: 2,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2264",
        modifiers: 4,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xAF",
        modifiers: 6,
        usage: 54
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 0,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ">",
        modifiers: 2,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u2265",
        modifiers: 4,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\u02D8",
        modifiers: 6,
        usage: 55
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 0,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "?",
        modifiers: 2,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xF7",
        modifiers: 4,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xBF",
        modifiers: 6,
        usage: 56
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 0,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 2,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 4,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "/",
        modifiers: 6,
        usage: 84
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 0,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 2,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 4,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "*",
        modifiers: 6,
        usage: 85
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 0,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 2,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 4,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "-",
        modifiers: 6,
        usage: 86
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 0,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 2,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 4,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "+",
        modifiers: 6,
        usage: 87
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 0,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 2,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 4,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "1",
        modifiers: 6,
        usage: 89
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 0,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 2,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 4,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "2",
        modifiers: 6,
        usage: 90
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 0,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 2,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 4,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "3",
        modifiers: 6,
        usage: 91
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 0,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 2,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 4,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "4",
        modifiers: 6,
        usage: 92
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 0,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 2,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 4,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "5",
        modifiers: 6,
        usage: 93
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 0,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 2,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 4,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "6",
        modifiers: 6,
        usage: 94
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 0,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 2,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 4,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "7",
        modifiers: 6,
        usage: 95
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 0,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 2,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 4,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "8",
        modifiers: 6,
        usage: 96
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 0,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 2,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 4,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "9",
        modifiers: 6,
        usage: 97
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 0,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 2,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 4,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "0",
        modifiers: 6,
        usage: 98
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 0,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 2,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 4,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: ".",
        modifiers: 6,
        usage: 99
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA7",
        modifiers: 0,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB1",
        modifiers: 2,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xA7",
        modifiers: 4,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "\xB1",
        modifiers: 6,
        usage: 100
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 0,
        usage: 103
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 2,
        usage: 103
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 4,
        usage: 103
      },
      {
        commitVerified: false,
        dead: false,
        glyph: "=",
        modifiers: 6,
        usage: 103
      }
    ]
  }
};

// src/projection/profiles/native-compositions.json
var native_compositions_default = {
  french: {
    inputSourceID: "com.apple.keylayout.French",
    recipes: [
      {
        glyph: "\xE9",
        steps: [
          {
            modifiers: 6,
            usage: 30
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xC9",
        steps: [
          {
            modifiers: 6,
            usage: 30
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xEA",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xCA",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xEE",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xCE",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xF4",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xD4",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xE2",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xC2",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xFB",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xDB",
        steps: [
          {
            modifiers: 0,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xEB",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xCB",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xEF",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xCF",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xF6",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xD6",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xE4",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xC4",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xFC",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xDC",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xFF",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 0,
            usage: 28
          }
        ]
      },
      {
        glyph: "\u0178",
        steps: [
          {
            modifiers: 2,
            usage: 47
          },
          {
            modifiers: 2,
            usage: 28
          }
        ]
      },
      {
        glyph: "\xE8",
        steps: [
          {
            modifiers: 0,
            usage: 49
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xC8",
        steps: [
          {
            modifiers: 0,
            usage: 49
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xE0",
        steps: [
          {
            modifiers: 0,
            usage: 49
          },
          {
            modifiers: 0,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xC0",
        steps: [
          {
            modifiers: 0,
            usage: 49
          },
          {
            modifiers: 2,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xF9",
        steps: [
          {
            modifiers: 0,
            usage: 49
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xD9",
        steps: [
          {
            modifiers: 0,
            usage: 49
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xE8",
        steps: [
          {
            modifiers: 0,
            usage: 50
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xC8",
        steps: [
          {
            modifiers: 0,
            usage: 50
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xE0",
        steps: [
          {
            modifiers: 0,
            usage: 50
          },
          {
            modifiers: 0,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xC0",
        steps: [
          {
            modifiers: 0,
            usage: 50
          },
          {
            modifiers: 2,
            usage: 20
          }
        ]
      },
      {
        glyph: "\xF9",
        steps: [
          {
            modifiers: 0,
            usage: 50
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xD9",
        steps: [
          {
            modifiers: 0,
            usage: 50
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      }
    ]
  },
  os: "Version 27.2 (Build 26B118)",
  provenance: "UCKeyTranslate, key-down, dead-key state reset per probe; dead glyph verified by unmodified Space",
  us: {
    inputSourceID: "com.apple.keylayout.US",
    recipes: [
      {
        glyph: "\xE9",
        steps: [
          {
            modifiers: 4,
            usage: 8
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xC9",
        steps: [
          {
            modifiers: 4,
            usage: 8
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xE2",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 0,
            usage: 4
          }
        ]
      },
      {
        glyph: "\xC2",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 2,
            usage: 4
          }
        ]
      },
      {
        glyph: "\xEA",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xCA",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xEE",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 0,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xCE",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 2,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xF4",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 0,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xD4",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 2,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xFB",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xDB",
        steps: [
          {
            modifiers: 4,
            usage: 12
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xE4",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 0,
            usage: 4
          }
        ]
      },
      {
        glyph: "\xC4",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 2,
            usage: 4
          }
        ]
      },
      {
        glyph: "\xEB",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xCB",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xEF",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 0,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xCF",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 2,
            usage: 12
          }
        ]
      },
      {
        glyph: "\xF6",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 0,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xD6",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 2,
            usage: 18
          }
        ]
      },
      {
        glyph: "\xFC",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xDC",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xFF",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 0,
            usage: 28
          }
        ]
      },
      {
        glyph: "\u0178",
        steps: [
          {
            modifiers: 4,
            usage: 24
          },
          {
            modifiers: 2,
            usage: 28
          }
        ]
      },
      {
        glyph: "\xE0",
        steps: [
          {
            modifiers: 4,
            usage: 53
          },
          {
            modifiers: 0,
            usage: 4
          }
        ]
      },
      {
        glyph: "\xC0",
        steps: [
          {
            modifiers: 4,
            usage: 53
          },
          {
            modifiers: 2,
            usage: 4
          }
        ]
      },
      {
        glyph: "\xE8",
        steps: [
          {
            modifiers: 4,
            usage: 53
          },
          {
            modifiers: 0,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xC8",
        steps: [
          {
            modifiers: 4,
            usage: 53
          },
          {
            modifiers: 2,
            usage: 8
          }
        ]
      },
      {
        glyph: "\xF9",
        steps: [
          {
            modifiers: 4,
            usage: 53
          },
          {
            modifiers: 0,
            usage: 24
          }
        ]
      },
      {
        glyph: "\xD9",
        steps: [
          {
            modifiers: 4,
            usage: 53
          },
          {
            modifiers: 2,
            usage: 24
          }
        ]
      }
    ]
  }
};

// src/projection/geometry.ts
var fingerUsages = {
  "left-pinkie": [53, 30, 43, 20, 57, 4, 225, 100, 29, 224],
  "left-ring": [31, 26, 22, 27],
  "left-middle": [32, 8, 7, 6],
  "left-index": [33, 34, 21, 23, 9, 10, 25, 5],
  "left-thumb": [44, 226, 227],
  "right-thumb": [230, 231],
  "right-index": [35, 36, 28, 24, 11, 13, 17, 16],
  "right-middle": [37, 12, 14, 54],
  "right-ring": [38, 18, 15, 55],
  "right-pinkie": [39, 45, 46, 42, 19, 47, 48, 49, 40, 51, 52, 56, 229]
};
var fingers = /* @__PURE__ */ new Map([["fn", "left-pinkie"]]);
for (const [finger, usages] of Object.entries(fingerUsages)) {
  for (const usage of usages)
    fingers.set(usage, finger);
}
fingers.set(41, "left-pinkie");
var rows = {
  0: "function",
  1.05: "number",
  2.1: "top",
  3.15: "home",
  4.2: "bottom",
  5.25: "thumb",
  5.75: "navigation"
};
function compactApple(iso) {
  const keys = [];
  function add(usage, label, x, y, width = 1, hand = "right", height = 1) {
    const key = {
      id: typeof usage === "number" ? keyId(usage) : usage,
      label,
      x,
      y,
      width,
      height,
      hand,
      row: typeof usage === "number" && usage >= 79 && usage <= 82 ? "navigation" : rows[y],
      finger: fingers.get(usage)
    };
    keys.push(key);
    return key;
  }
  add(41, "Esc", 0, 0, 1.5, "left", 0.7);
  const functionLabels = [
    "Bright \u2212",
    "Bright +",
    "Mission",
    "Spotlight",
    "Dictation",
    "DND",
    "Previous",
    "Play/pause",
    "Next",
    "Mute",
    "Vol \u2212",
    "Vol +"
  ];
  functionLabels.forEach((label, i) => add(
    58 + i,
    label,
    1.5 + i * 1.125,
    0,
    1.125,
    i < 6 ? "left" : "right",
    0.7
  ));
  add(53, "", 0, 1.05, 1, "left");
  [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 45, 46].forEach((usage, i) => add(usage, "", i + 1, 1.05, 1, i < 5 ? "left" : "right"));
  add(42, "Backspace", 13, 1.05, 2);
  add(43, "Tab", 0, 2.1, 1.5, "left");
  [20, 26, 8, 21, 23, 28, 24, 12, 18, 19, 47, 48].forEach((usage, i) => add(usage, "", 1.5 + i, 2.1, 1, i < 5 ? "left" : "right"));
  if (!iso)
    add(49, "", 13.5, 2.1, 1.5);
  add(57, "Caps", 0, 3.15, 1.75, "left");
  [4, 22, 7, 9, 10, 11, 13, 14, 15, 51, 52].forEach((usage, i) => add(usage, "", 1.75 + i, 3.15, 1, i < 5 ? "left" : "right"));
  if (iso) {
    add(49, "", 12.75, 3.15);
    add(40, "Enter", 13.5, 2.1, 1.5, "right", 2.05).isoEnter = true;
  } else
    add(40, "Enter", 12.75, 3.15, 2.25);
  add(225, "Shift", 0, 4.2, iso ? 1.25 : 2.25, "left").modifier = { family: "Shift", side: "left" };
  if (iso)
    add(100, "", 1.25, 4.2, 1, "left");
  [29, 27, 6, 25, 5, 17, 16, 54, 55, 56].forEach((usage, i) => add(usage, "", 2.25 + i, 4.2, 1, i < 5 ? "left" : "right"));
  add(229, "Shift", 12.25, 4.2, 2.75).modifier = { family: "Shift", side: "right" };
  add("fn", "Fn", 0, 5.25, 1, "left").modifier = { family: "Fn" };
  add(224, "Control", 1, 5.25, 1, "left").modifier = { family: "Control", side: "left" };
  add(226, "Option", 2, 5.25, 1, "left").modifier = { family: "Option", side: "left" };
  add(227, "Cmd", 3, 5.25, 1.25, "left").modifier = { family: "Command", side: "left" };
  add(44, "Space", 4.25, 5.25, 5.5, "left");
  add(231, "Cmd", 9.75, 5.25, 1.25).modifier = { family: "Command", side: "right" };
  add(230, "Option", 11, 5.25).modifier = { family: "Option", side: "right" };
  add(80, "\u2190", 12, 5.75, 1, "right", 0.5);
  add(81, "\u2193", 13, 5.75, 1, "right", 0.5);
  add(82, "\u2191", 13, 5.25, 1, "right", 0.5);
  add(79, "\u2192", 14, 5.75, 1, "right", 0.5);
  return keys;
}

// src/projection/profiles.ts
var profileProvenance = { os: generated_layouts_default.os, method: generated_layouts_default.provenance };
var customGlyphAliases = /* @__PURE__ */ new Map([
  [32335, "^"],
  [32336, "`"],
  [32337, "~"],
  [32338, "\u2019"]
]);
function textModifiers(bits) {
  return [
    ...bits & 2 ? [{ family: "Shift" }] : [],
    ...bits & 4 ? [{ family: "Option" }] : []
  ];
}
var frenchLetters = "\xE9\xE8\xEA\xEB\xE0\xE2\xE4\xEE\xEF\xF4\xF6\xF9\xFB\xFC\xFF\xE7\u0153\xE6";
var compositionCharacters = new Set(frenchLetters + frenchLetters.toUpperCase());
function createProfile(id, name, outputs, iso, recipes = [], angle = false) {
  const keys = compactApple(iso);
  if (angle) {
    const fingers2 = { "hid-1d": "left-ring", "hid-1b": "left-middle", "hid-6": "left-index" };
    for (const key of keys)
      if (key.id in fingers2)
        key.finger = fingers2[key.id];
  }
  const glyphRoutes = /* @__PURE__ */ new Map();
  const controlRoutes = /* @__PURE__ */ new Map();
  const available = new Set(keys.map((key) => key.id));
  for (const key of keys) {
    const usage = Number.parseInt(key.id.slice(4), 16);
    if (!(usage >= 4 && usage <= 39 || usage >= 45 && usage <= 56 || usage === 100))
      continue;
    for (const modifiers of [0, 2]) {
      if (!outputs.some((output) => output.usage === usage && output.modifiers === modifiers && output.glyph.length > 0)) {
        throw new Error(`Unverified base/Shift definition: ${id}/${key.id}/${modifiers}`);
      }
    }
  }
  for (const output of outputs) {
    const position = keyId(output.usage === 50 ? 49 : output.usage);
    if (!available.has(position))
      continue;
    if (output.dead && (!output.commitVerified || !["^", "`", "~"].includes(output.glyph)))
      continue;
    const route = {
      priority: output.usage * 8 + output.modifiers,
      steps: [{ keyId: position, modifiers: textModifiers(output.modifiers) }]
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
    if (!compositionCharacters.has(recipe.glyph) || recipe.steps.length !== 2)
      throw new Error(`Unapproved composition: ${id}/${recipe.glyph}`);
    const steps = recipe.steps.map((step) => {
      const position = keyId(step.usage === 50 ? 49 : step.usage);
      if (!available.has(position) || ![0, 2, 4, 6].includes(step.modifiers))
        throw new Error(`Invalid composition step: ${id}/${position}`);
      return { keyId: position, modifiers: textModifiers(step.modifiers) };
    });
    if (!outputs.some((o) => o.usage === recipe.steps[0].usage && o.modifiers === recipe.steps[0].modifiers && o.dead) || !outputs.some((o) => o.usage === recipe.steps[1].usage && o.modifiers === recipe.steps[1].modifiers && !o.dead)) {
      throw new Error(`Composition requires one dead key then a base key: ${id}/${recipe.glyph}`);
    }
    const routes = glyphRoutes.get(recipe.glyph) || [];
    routes.push({ steps, recipe: "dead-key-composition", priority: 1e5 + i });
    glyphRoutes.set(recipe.glyph, routes);
  }
  function control(action, usage, fn = false) {
    controlRoutes.set(action, [{ priority: usage, steps: [{ keyId: keyId(usage), modifiers: fn ? [{ family: "Fn" }] : [] }] }]);
  }
  [
    ["Enter", 40],
    ["Escape", 41],
    ["Backspace", 42],
    ["Tab", 43],
    ["Caps Lock", 57],
    ["Right", 79],
    ["Left", 80],
    ["Down", 81],
    ["Up", 82]
  ].forEach(([action, usage]) => control(String(action), Number(usage)));
  [["Delete", 42], ["Home", 80], ["End", 79], ["Page Up", 82], ["Page Down", 81]].forEach(([action, usage]) => control(String(action), Number(usage), true));
  const media = [
    "Brightness down",
    "Brightness up",
    "Mission Control",
    "Spotlight",
    "Dictation",
    "Do Not Disturb",
    "Previous",
    "Play/pause",
    "Next",
    "Mute",
    "Volume down",
    "Volume up"
  ];
  media.forEach((action, i) => {
    control(action, 58 + i);
    control(`F${i + 1}`, 58 + i, true);
  });
  for (const key of keys) {
    if (key.label)
      continue;
    const usage = parseInt(key.id.slice(4), 16);
    const base = outputs.find((output) => output.usage === usage && output.modifiers === 0);
    if (!base)
      throw new Error(`Missing key legend: ${id}/${key.id}`);
    key.label = base.glyph.length === 1 && /[a-z]/.test(base.glyph) ? base.glyph.toUpperCase() : base.glyph;
  }
  return { id, name, keys, outputs, glyphRoutes, controlRoutes };
}
var frenchProfile = createProfile("macos-french-iso-v1", "French AZERTY \xB7 ISO", generated_layouts_default.french.outputs, true);
function createNativeTarget(kind) {
  return createProfile(
    kind === "french" ? "macos-french-iso-v1" : "macos-us-ansi-v1",
    kind === "french" ? "French AZERTY \xB7 ISO" : "US QWERTY \xB7 ANSI",
    generated_layouts_default[kind].outputs,
    kind === "french",
    native_compositions_default[kind].recipes
  );
}

// src/projection/recordedAction.ts
function normalizeRecordedAction(group) {
  const code = parseInt(group.keycode, 16);
  if (group.type === "plain" && code >= 256 && code <= 8191) {
    const mask = code >> 8 & 31;
    const embedded = mask & 16 ? (mask & 15) << 4 : mask & 15;
    return { usage: code & 255, modifiers: group.modifiers | embedded };
  }
  return { usage: code, modifiers: group.modifiers };
}

// src/projection/decode.ts
var modifierBits = [
  { family: "Control", side: "left" },
  { family: "Shift", side: "left" },
  { family: "Option", side: "left" },
  { family: "Command", side: "left" },
  { family: "Control", side: "right" },
  { family: "Shift", side: "right" },
  { family: "Option", side: "right" },
  { family: "Command", side: "right" }
];
var controls = /* @__PURE__ */ new Map([
  [40, "Enter"],
  [41, "Escape"],
  [42, "Backspace"],
  [43, "Tab"],
  [57, "Caps Lock"],
  [74, "Home"],
  [75, "Page Up"],
  [76, "Delete"],
  [77, "End"],
  [78, "Page Down"],
  [79, "Right"],
  [80, "Left"],
  [81, "Down"],
  [82, "Up"],
  [88, "Enter"],
  [127, "Mute"],
  [128, "Volume up"],
  [129, "Volume down"],
  [168, "Mute"],
  [169, "Volume up"],
  [170, "Volume down"],
  [171, "Next"],
  [172, "Previous"],
  [174, "Play/pause"],
  [189, "Brightness up"],
  [190, "Brightness down"],
  [193, "Mission Control"]
]);
function decode(group, source) {
  const { usage, modifiers: recordedModifiers } = normalizeRecordedAction(group);
  if (usage >= 224 && usage <= 231 && (group.type === "plain" || group.type === "mtap"))
    return { kind: "modifier-only" };
  if (group.type !== "plain")
    return { kind: "unresolved", reason: "source-action-unknown" };
  const modifiers = modifierBits.filter((_, i) => recordedModifiers & 1 << i);
  const control = controls.get(usage) || (usage >= 58 && usage <= 69 ? `F${usage - 57}` : void 0);
  if (control)
    return { kind: "control", control, modifiers };
  const shortcutModifiers = modifiers.filter((mod) => mod.family === "Command" || mod.family === "Control");
  const alias = customGlyphAliases.get(usage);
  if (alias)
    return {
      kind: "glyph",
      glyph: alias,
      modifiers: shortcutModifiers,
      shortcut: shortcutModifiers.length > 0,
      alias: true
    };
  const textBits = (recordedModifiers & 34 ? 2 : 0) | (recordedModifiers & 68 ? 4 : 0);
  const output = source.outputs.find((entry2) => entry2.usage === usage && entry2.modifiers === textBits);
  if (!output)
    return { kind: "unresolved", reason: "source-action-unknown" };
  if (output.dead)
    return { kind: "unresolved", reason: "source-dead-key" };
  return {
    kind: "glyph",
    glyph: output.glyph,
    modifiers: shortcutModifiers,
    shortcut: shortcutModifiers.length > 0,
    alias: false
  };
}

// src/projection/participation.ts
function stepModifiers(required, retained) {
  const normalize = (mod) => mod.family === "Shift" || mod.family === "Option" ? { family: mod.family } : mod;
  const result = retained.map(normalize);
  for (const mod of required.map(normalize)) {
    if (!result.some((existing) => existing.family === mod.family))
      result.push(mod);
  }
  return result.filter((mod, i) => result.findIndex((other) => other.family === mod.family && other.side === mod.side) === i);
}
function resolveStep(step, retained, target) {
  const base = target.keys.find((key) => key.id === step.keyId);
  if (!base)
    throw new Error(`Invalid profile route: ${target.id}/${step.keyId}`);
  const participants = /* @__PURE__ */ new Map([[base.id, base]]);
  const missing = /* @__PURE__ */ new Set();
  for (const mod of stepModifiers(step.modifiers, retained)) {
    const side = mod.family === "Shift" || mod.family === "Option" ? base.hand === "left" ? "right" : "left" : mod.side;
    const key = target.keys.find((entry2) => entry2.modifier?.family === mod.family && (!side || entry2.modifier.side === side));
    if (key)
      participants.set(key.id, key);
    else
      missing.add(`${mod.side || side || "unassigned"} ${mod.family}`);
  }
  const keys = [...participants.values()];
  return {
    keys,
    missing: [...missing],
    uses: keys.length + missing.size,
    modifiers: keys.filter((key) => key.modifier).length + missing.size
  };
}

// src/projection/routes.ts
function candidateRoutes(action, target) {
  return (action.kind === "glyph" ? target.glyphRoutes.get(action.glyph) : target.controlRoutes.get(action.control)) || [];
}
function selectRoute(action, target) {
  const candidates = candidateRoutes(action, target).filter((route) => !(action.kind === "glyph" && action.shortcut && route.steps.length > 1));
  const ranked = candidates.map((route) => {
    const steps = route.steps.map((step) => resolveStep(step, action.modifiers, target));
    return { route, uses: steps.reduce((sum, step) => sum + step.uses, 0), modifiers: steps.reduce((sum, step) => sum + step.modifiers, 0) };
  });
  ranked.sort((a, b) => a.uses - b.uses || a.route.steps.length - b.route.steps.length || a.modifiers - b.modifiers || a.route.priority - b.route.priority || JSON.stringify(a.route.steps).localeCompare(JSON.stringify(b.route.steps)));
  return ranked[0]?.route;
}

// src/projection/project.ts
function project(source, sourceProfile, target) {
  const result = {
    profileId: target.id,
    sourceEventCount: source.sourceEventCount,
    sourceModifierCount: 0,
    baseActionCount: 0,
    supportedActionCount: 0,
    unmappedActionCount: 0,
    estimatedUseCount: 0,
    recipeActionCount: 0,
    compositionActionCount: 0,
    aliasActionCount: 0,
    keyUses: {},
    contributions: {},
    unplacedModifiers: {},
    unmapped: [],
    modifierUses: { Shift: 0, Option: 0, Command: 0, Control: 0, Fn: 0 }
  };
  for (const key of target.keys) {
    result.keyUses[key.id] = 0;
    result.contributions[key.id] = [];
  }
  for (const group of source.groups) {
    if (group.count === 0)
      continue;
    const action = decode(group, sourceProfile);
    if (action.kind === "modifier-only") {
      result.sourceModifierCount += group.count;
      continue;
    }
    result.baseActionCount += group.count;
    const actionLabel = action.kind === "glyph" ? `${action.modifiers.map((mod) => mod.family).join("+")}${action.shortcut ? "+" : ""}${JSON.stringify(action.glyph)}` : action.kind === "control" ? [...action.modifiers.map((mod) => mod.family), action.control].join("+") : `0x${group.keycode} (${group.type})`;
    const route = action.kind === "unresolved" ? void 0 : selectRoute(action, target);
    if (action.kind === "unresolved" || !route) {
      const reason = action.kind === "unresolved" ? action.reason : action.kind === "glyph" && action.shortcut && candidateRoutes(action, target).some((candidate) => candidate.steps.length > 1) ? "shortcut-needs-composition" : "target-output-unsupported";
      result.unmapped.push({ source: group, action: actionLabel, reason });
      result.unmappedActionCount += group.count;
      continue;
    }
    result.supportedActionCount += group.count;
    if (action.kind === "glyph" && action.alias)
      result.aliasActionCount += group.count;
    if (route.recipe)
      result.recipeActionCount += group.count;
    if (route.recipe === "dead-key-composition")
      result.compositionActionCount += group.count;
    for (const step of route.steps) {
      const { keys: participants, missing } = resolveStep(step, action.modifiers, target);
      const description = participants.map((key) => key.modifier ? `${key.modifier.side || ""} ${key.modifier.family}`.trim() : key.label).join(" + ") + (route.recipe === "literal-dead-key-commit" ? " \xB7 literal dead-key + Space recipe" : route.recipe ? " \xB7 verified dead-key composition" : "");
      for (const key of participants) {
        result.keyUses[key.id] += group.count;
        result.estimatedUseCount += group.count;
        if (key.modifier)
          result.modifierUses[key.modifier.family] += group.count;
        const contribution = result.contributions[key.id].find((entry2) => entry2.action === actionLabel && entry2.route === description);
        if (contribution)
          contribution.count += group.count;
        else
          result.contributions[key.id].push({ action: actionLabel, route: description, count: group.count });
      }
      for (const label of missing) {
        result.unplacedModifiers[label] = (result.unplacedModifiers[label] || 0) + group.count;
        const family = modifierFamilies.find((entry2) => label.endsWith(entry2));
        result.modifierUses[family] += group.count;
        result.estimatedUseCount += group.count;
      }
    }
  }
  if (result.sourceModifierCount + result.baseActionCount !== source.sourceEventCount || result.supportedActionCount + result.unmappedActionCount !== result.baseActionCount || !Number.isSafeInteger(result.estimatedUseCount))
    throw new Error("Projection accounting does not reconcile");
  for (const entries of Object.values(result.contributions))
    entries.sort((a, b) => b.count - a.count);
  result.unmapped.sort((a, b) => b.source.count - a.source.count);
  return result;
}

// src/projection/usage.ts
function emptyUsage(total) {
  return {
    total,
    rows: { function: 0, number: 0, top: 0, home: 0, bottom: 0, thumb: 0, navigation: 0, unplaced: 0 },
    hands: { left: 0, right: 0, unplaced: 0 },
    fingers: {
      "left-pinkie": 0,
      "left-ring": 0,
      "left-middle": 0,
      "left-index": 0,
      "left-thumb": 0,
      "right-thumb": 0,
      "right-index": 0,
      "right-middle": 0,
      "right-ring": 0,
      "right-pinkie": 0,
      unassigned: 0
    }
  };
}
function mergeObservedLayers(observed) {
  const rowCount = Math.max(
    0,
    ...observed.keymaps.map((layer2) => layer2.length),
    ...observed.keymapUsage.map((layer2) => layer2.length),
    ...(observed.physicalKeys || []).map((key) => key.row + 1)
  );
  const columnCount = Math.max(
    0,
    ...observed.keymaps.flatMap((layer2) => layer2.map((row) => row.length)),
    ...observed.keymapUsage.flatMap((layer2) => layer2.map((row) => row.length)),
    ...(observed.physicalKeys || []).map((key) => key.column + 1)
  );
  const matrix = Array.from({ length: rowCount }, () => Array(columnCount).fill(0));
  for (const layer2 of observed.keymapUsage) {
    layer2.forEach((row, r) => row.forEach((count, c) => {
      matrix[r][c] += count;
    }));
  }
  const layer = matrix.map((row, r) => row.map((_, c) => observed.keymaps[0]?.[r]?.[c] || []));
  return { matrix, layer };
}
var fingerOrder = [
  "left-pinkie",
  "left-ring",
  "left-middle",
  "left-index",
  "left-thumb",
  "right-thumb",
  "right-index",
  "right-middle",
  "right-ring",
  "right-pinkie"
];
var observedRows = ["top", "home", "bottom", "thumb"];
function observedUsage(observed) {
  const usage = emptyUsage(observed.totalKeypresses);
  const { matrix } = mergeObservedLayers(observed);
  const keys = new Map((observed.physicalKeys || []).map((key) => [`${key.row}/${key.column}`, key]));
  let total = 0;
  matrix.forEach((row, r) => row.forEach((count, c) => {
    const key = keys.get(`${r}/${c}`);
    usage.rows[observedRows[r] || "unplaced"] += count;
    usage.hands[key?.hand === 0 ? "left" : key?.hand === 1 ? "right" : "unplaced"] += count;
    usage.fingers[key?.finger != null ? fingerOrder[key.finger] || "unassigned" : "unassigned"] += count;
    total += count;
  }));
  const unplaced = observed.unplacedUses || 0;
  usage.rows.unplaced += unplaced;
  usage.hands.unplaced += unplaced;
  usage.fingers.unassigned += unplaced;
  if (total + unplaced !== usage.total)
    throw new Error("Observed usage does not reconcile");
  return usage;
}
function projectedUsage(result, profile) {
  const usage = emptyUsage(result.estimatedUseCount);
  const keys = new Map(profile.keys.map((key) => [key.id, key]));
  let placed = 0;
  for (const [id, count] of Object.entries(result.keyUses)) {
    const key = keys.get(id);
    if (!key)
      throw new Error(`Unknown reference key: ${profile.id}/${id}`);
    usage.rows[key.row] += count;
    usage.hands[key.hand] += count;
    usage.fingers[key.finger || "unassigned"] += count;
    placed += count;
  }
  const unplaced = Object.values(result.unplacedModifiers).reduce((sum, count) => sum + count, 0);
  usage.rows.unplaced = unplaced;
  usage.hands.unplaced = unplaced;
  usage.fingers.unassigned += unplaced;
  if (placed + unplaced !== usage.total)
    throw new Error("Projected usage does not reconcile");
  return usage;
}

// src/projection/printing.ts
function isPrintingAction(group, profile) {
  const action = decode(group, profile);
  return action.kind === "glyph" && !action.shortcut && action.glyph.length > 0 && !/[\p{C}\p{Zl}\p{Zp}]/u.test(action.glyph);
}
function printingOnly(source, positions, profile) {
  if (!source.observed)
    throw new Error("Printing comparison requires recorded coordinates");
  if (positions.reduce((sum, group) => sum + group.count, 0) !== source.sourceEventCount) {
    throw new Error("Printing coordinates do not match source events");
  }
  const groups = source.groups.filter((group) => isPrintingAction(group, profile));
  const sourceEventCount = groups.reduce((sum, group) => sum + group.count, 0);
  const modifierPositions = /* @__PURE__ */ new Map();
  const addModifier = (group, row, column) => {
    if (decode(group, profile).kind !== "modifier-only")
      return;
    const { usage } = normalizeRecordedAction(group);
    const candidates = modifierPositions.get(usage) || /* @__PURE__ */ new Map();
    candidates.set(`${row}/${column}`, { row, column });
    modifierPositions.set(usage, candidates);
  };
  source.observed.keymaps.forEach((layer) => layer.forEach((row, r) => row.forEach((keys, c) => {
    for (const key of keys)
      addModifier({ ...key, modifiers: 0, count: 0 }, r, c);
  })));
  for (const group of positions)
    addModifier(group, group.row, group.column);
  const keymapUsage = [];
  const addUse = (row, column, count) => {
    keymapUsage[0] ||= [];
    keymapUsage[0][row] ||= [];
    keymapUsage[0][row][column] = (keymapUsage[0][row][column] || 0) + count;
  };
  let modifierParticipationCount = 0, unplacedUses = 0, retainedPositions = 0;
  for (const group of positions) {
    if (!isPrintingAction(group, profile))
      continue;
    retainedPositions += group.count;
    const participants = /* @__PURE__ */ new Map([[`${group.row}/${group.column}`, { row: group.row, column: group.column }]]);
    for (const bit of [1, 2, 5, 6]) {
      if (!(group.modifiers & 1 << bit))
        continue;
      const candidates = modifierPositions.get(224 + bit);
      if (candidates?.size === 1) {
        const position = candidates.values().next().value;
        const key = `${position.row}/${position.column}`;
        if (!participants.has(key)) {
          participants.set(key, position);
          modifierParticipationCount += group.count;
        }
      } else {
        unplacedUses += group.count;
        modifierParticipationCount += group.count;
      }
    }
    for (const { row, column } of participants.values())
      addUse(row, column, group.count);
  }
  if (retainedPositions !== sourceEventCount)
    throw new Error("Printing groups and coordinates do not reconcile");
  return {
    groups,
    sourceEventCount,
    excludedEventCount: source.sourceEventCount - sourceEventCount,
    modifierParticipationCount,
    observed: {
      keymaps: source.observed.keymaps,
      physicalKeys: source.observed.physicalKeys,
      keymapUsage: keymapUsage.map((layer) => Array.from(layer, (row) => Array.from(row || [], (count) => count || 0))),
      totalKeypresses: sourceEventCount + modifierParticipationCount,
      unplacedUses
    }
  };
}

// src/projection/profiles/additional-layouts.json
var additional_layouts_default = {
  colemak: {
    name: "Colemak DH ISO - Extended",
    sha256: "7cc10c93ef65f40d87803ce9371eae3c6b696cb9bdda8f96915edc2b20453b65",
    outputs: [
      {
        usage: 4,
        modifiers: 0,
        glyph: "a",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 2,
        glyph: "A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 4,
        glyph: "\xAF",
        dead: true,
        commitVerified: true
      },
      {
        usage: 4,
        modifiers: 6,
        glyph: "\u0304",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 0,
        glyph: "`",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 2,
        glyph: "~",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 4,
        glyph: "`",
        dead: true,
        commitVerified: true
      },
      {
        usage: 5,
        modifiers: 6,
        glyph: "\u0300",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 0,
        glyph: "d",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 2,
        glyph: "D",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 4,
        glyph: "\xF0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 6,
        glyph: "\xD0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 0,
        glyph: "s",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 2,
        glyph: "S",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 4,
        glyph: "\xDF",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 6,
        glyph: "\xA0\u0311",
        dead: true,
        commitVerified: true
      },
      {
        usage: 8,
        modifiers: 0,
        glyph: "f",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 2,
        glyph: "F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 4,
        glyph: "\u0192",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 6,
        glyph: "\xA0\u0330",
        dead: true,
        commitVerified: true
      },
      {
        usage: 9,
        modifiers: 0,
        glyph: "t",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 2,
        glyph: "T",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 4,
        glyph: "\xFE",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 6,
        glyph: "\xDE",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 0,
        glyph: "g",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 2,
        glyph: "G",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 4,
        glyph: "\xA9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 6,
        glyph: "\u2038",
        dead: true,
        commitVerified: true
      },
      {
        usage: 11,
        modifiers: 0,
        glyph: "m",
        dead: false,
        commitVerified: false
      },
      {
        usage: 11,
        modifiers: 2,
        glyph: "M",
        dead: false,
        commitVerified: false
      },
      {
        usage: 11,
        modifiers: 4,
        glyph: "\u02DB",
        dead: true,
        commitVerified: true
      },
      {
        usage: 11,
        modifiers: 6,
        glyph: "\u0328",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 0,
        glyph: "u",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 2,
        glyph: "U",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 4,
        glyph: "\xA8",
        dead: true,
        commitVerified: true
      },
      {
        usage: 12,
        modifiers: 6,
        glyph: "\u0308",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 0,
        glyph: "n",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 2,
        glyph: "N",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 4,
        glyph: "\u02DC",
        dead: true,
        commitVerified: true
      },
      {
        usage: 13,
        modifiers: 6,
        glyph: "\u0303",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 0,
        glyph: "e",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 2,
        glyph: "E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 4,
        glyph: "\xB4",
        dead: true,
        commitVerified: true
      },
      {
        usage: 14,
        modifiers: 6,
        glyph: "\u0301",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 0,
        glyph: "i",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 2,
        glyph: "I",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 4,
        glyph: "\u02BC",
        dead: true,
        commitVerified: true
      },
      {
        usage: 15,
        modifiers: 6,
        glyph: "\u031B",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 0,
        glyph: "h",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 2,
        glyph: "H",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 4,
        glyph: "\u02CD",
        dead: true,
        commitVerified: true
      },
      {
        usage: 16,
        modifiers: 6,
        glyph: "\u0331",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 0,
        glyph: "k",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 2,
        glyph: "K",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 4,
        glyph: "\u02DA",
        dead: true,
        commitVerified: true
      },
      {
        usage: 17,
        modifiers: 6,
        glyph: "\u030A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 0,
        glyph: "y",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 2,
        glyph: "Y",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 4,
        glyph: "\xA5",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 6,
        glyph: "\xA0\u030F",
        dead: true,
        commitVerified: true
      },
      {
        usage: 19,
        modifiers: 0,
        glyph: ";",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 2,
        glyph: ":",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 4,
        glyph: "\u2026",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 6,
        glyph: "\u2116",
        dead: true,
        commitVerified: true
      },
      {
        usage: 20,
        modifiers: 0,
        glyph: "q",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 2,
        glyph: "Q",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 4,
        glyph: "\u0153",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 6,
        glyph: "\u0152",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 0,
        glyph: "p",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 2,
        glyph: "P",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 4,
        glyph: ",",
        dead: true,
        commitVerified: true
      },
      {
        usage: 21,
        modifiers: 6,
        glyph: "\u0326",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 0,
        glyph: "r",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 2,
        glyph: "R",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 4,
        glyph: "\xAE",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 6,
        glyph: "\u2030",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 0,
        glyph: "b",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 2,
        glyph: "B",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 4,
        glyph: "\u02D8",
        dead: true,
        commitVerified: true
      },
      {
        usage: 23,
        modifiers: 6,
        glyph: "\u0306",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 0,
        glyph: "l",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 2,
        glyph: "L",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 4,
        glyph: "-",
        dead: true,
        commitVerified: true
      },
      {
        usage: 24,
        modifiers: 6,
        glyph: "\u0335",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 0,
        glyph: "v",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 2,
        glyph: "V",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 4,
        glyph: "\u02C7",
        dead: true,
        commitVerified: true
      },
      {
        usage: 25,
        modifiers: 6,
        glyph: "\u030C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 0,
        glyph: "w",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 2,
        glyph: "W",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 4,
        glyph: "\u02D9",
        dead: true,
        commitVerified: true
      },
      {
        usage: 26,
        modifiers: 6,
        glyph: "\u0307",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 0,
        glyph: "c",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 2,
        glyph: "C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 4,
        glyph: "\xB8",
        dead: true,
        commitVerified: true
      },
      {
        usage: 27,
        modifiers: 6,
        glyph: "\u0327",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 0,
        glyph: "j",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 2,
        glyph: "J",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 4,
        glyph: "\u02DD",
        dead: true,
        commitVerified: true
      },
      {
        usage: 28,
        modifiers: 6,
        glyph: "\u030B",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 0,
        glyph: "x",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 2,
        glyph: "X",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 4,
        glyph: ".",
        dead: true,
        commitVerified: true
      },
      {
        usage: 29,
        modifiers: 6,
        glyph: "\u0323",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 0,
        glyph: "1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 2,
        glyph: "!",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 4,
        glyph: "\xA1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 6,
        glyph: "\u2044",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 0,
        glyph: "2",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 2,
        glyph: "@",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 4,
        glyph: "\u2122",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 6,
        glyph: "\u20AC",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 0,
        glyph: "3",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 2,
        glyph: "#",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 4,
        glyph: "\xA3",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 6,
        glyph: "\u2039",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 0,
        glyph: "4",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 2,
        glyph: "$",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 4,
        glyph: "\xA2",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 6,
        glyph: "\u203A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 0,
        glyph: "5",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 2,
        glyph: "%",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 4,
        glyph: "\xA7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 6,
        glyph: "\u2020",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 0,
        glyph: "6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 2,
        glyph: "^",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 4,
        glyph: "\u02C6",
        dead: true,
        commitVerified: true
      },
      {
        usage: 35,
        modifiers: 6,
        glyph: "\u0302",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 0,
        glyph: "7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 2,
        glyph: "&",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 4,
        glyph: "\xB6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 6,
        glyph: "\u2021",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 0,
        glyph: "8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 2,
        glyph: "*",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 4,
        glyph: "\u2022",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 6,
        glyph: "\xB0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 0,
        glyph: "9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 2,
        glyph: "(",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 4,
        glyph: "\xAA",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 6,
        glyph: "\xB7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 0,
        glyph: "0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 2,
        glyph: ")",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 4,
        glyph: "\xBA",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 6,
        glyph: "\u201A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 0,
        glyph: " ",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 2,
        glyph: " ",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 4,
        glyph: "\xA0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 6,
        glyph: "\xA0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 0,
        glyph: "-",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 2,
        glyph: "_",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 4,
        glyph: "\u2013",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 6,
        glyph: "\u2014",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 0,
        glyph: "=",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 2,
        glyph: "+",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 4,
        glyph: "\u2260",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 6,
        glyph: "\xB1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 0,
        glyph: "[",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 2,
        glyph: "{",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 4,
        glyph: "\u201C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 6,
        glyph: "\u201D",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 0,
        glyph: "]",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 2,
        glyph: "}",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 4,
        glyph: "\u2018",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 6,
        glyph: "\u2019",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 0,
        glyph: "\\",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 2,
        glyph: "|",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 4,
        glyph: "\xAB",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 6,
        glyph: "\xBB",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 0,
        glyph: "o",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 2,
        glyph: "O",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 4,
        glyph: "\xF8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 6,
        glyph: "\xD8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 0,
        glyph: "'",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 2,
        glyph: '"',
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 4,
        glyph: "\xE6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 6,
        glyph: "\xC6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 0,
        glyph: "\xA7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 2,
        glyph: "\xB1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 4,
        glyph: "\xA7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 6,
        glyph: "\xB1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 0,
        glyph: ",",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 2,
        glyph: "<",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 4,
        glyph: "\u2264",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 6,
        glyph: "\u201E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 0,
        glyph: ".",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 2,
        glyph: ">",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 4,
        glyph: "\u2265",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 6,
        glyph: "\u0294",
        dead: true,
        commitVerified: true
      },
      {
        usage: 56,
        modifiers: 0,
        glyph: "/",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 2,
        glyph: "?",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 4,
        glyph: "\xF7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 6,
        glyph: "\xBF",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 0,
        glyph: "z",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 2,
        glyph: "Z",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 4,
        glyph: "\u02C0",
        dead: true,
        commitVerified: true
      },
      {
        usage: 100,
        modifiers: 6,
        glyph: "\u0309",
        dead: false,
        commitVerified: false
      }
    ],
    recipes: [
      {
        glyph: "\xE0",
        steps: [
          {
            usage: 5,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC0",
        steps: [
          {
            usage: 5,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xF9",
        steps: [
          {
            usage: 5,
            modifiers: 4
          },
          {
            usage: 12,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xD9",
        steps: [
          {
            usage: 5,
            modifiers: 4
          },
          {
            usage: 12,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE8",
        steps: [
          {
            usage: 5,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC8",
        steps: [
          {
            usage: 5,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE4",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC4",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xFC",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 12,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xDC",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 12,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEB",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCB",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEF",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 15,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCF",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 15,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xFF",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 18,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\u0178",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 18,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xF6",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 51,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xD6",
        steps: [
          {
            usage: 12,
            modifiers: 4
          },
          {
            usage: 51,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE9",
        steps: [
          {
            usage: 14,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC9",
        steps: [
          {
            usage: 14,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE7",
        steps: [
          {
            usage: 27,
            modifiers: 4
          },
          {
            usage: 27,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC7",
        steps: [
          {
            usage: 27,
            modifiers: 4
          },
          {
            usage: 27,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE2",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC2",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xFB",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 12,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xDB",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 12,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEA",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCA",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 14,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEE",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 15,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCE",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 15,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xF4",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 51,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xD4",
        steps: [
          {
            usage: 35,
            modifiers: 4
          },
          {
            usage: 51,
            modifiers: 2
          }
        ]
      }
    ]
  },
  bepo: {
    name: "b\xE9po",
    sha256: "1ae285b4d523e3969474eab01084fdf09145f00cdb4daae1245ac2d52e30b6ba",
    outputs: [
      {
        usage: 4,
        modifiers: 0,
        glyph: "a",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 2,
        glyph: "A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 4,
        glyph: "\xE6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 6,
        glyph: "\xC6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 0,
        glyph: "k",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 2,
        glyph: "K",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 4,
        glyph: "~",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 6,
        glyph: "\u2011",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 0,
        glyph: "x",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 2,
        glyph: "X",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 4,
        glyph: "}",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 6,
        glyph: "\u2019",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 0,
        glyph: "i",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 2,
        glyph: "I",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 4,
        glyph: "\xA8",
        dead: true,
        commitVerified: true
      },
      {
        usage: 7,
        modifiers: 6,
        glyph: "\u02D9",
        dead: true,
        commitVerified: true
      },
      {
        usage: 8,
        modifiers: 0,
        glyph: "p",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 2,
        glyph: "P",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 4,
        glyph: "&",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 6,
        glyph: "\xA7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 0,
        glyph: "e",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 2,
        glyph: "E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 4,
        glyph: "\u20AC",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 6,
        glyph: "\xA4",
        dead: true,
        commitVerified: true
      },
      {
        usage: 10,
        modifiers: 0,
        glyph: ",",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 2,
        glyph: ";",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 4,
        glyph: "'",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 6,
        glyph: ",",
        dead: true,
        commitVerified: true
      },
      {
        usage: 11,
        modifiers: 0,
        glyph: "c",
        dead: false,
        commitVerified: false
      },
      {
        usage: 11,
        modifiers: 2,
        glyph: "C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 11,
        modifiers: 4,
        glyph: "\xB8",
        dead: true,
        commitVerified: true
      },
      {
        usage: 11,
        modifiers: 6,
        glyph: "\xA9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 0,
        glyph: "d",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 2,
        glyph: "D",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 4,
        glyph: "\u221E ",
        dead: true,
        commitVerified: true
      },
      {
        usage: 12,
        modifiers: 6,
        glyph: "\u2623",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 0,
        glyph: "t",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 2,
        glyph: "T",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 4,
        glyph: "\u1D49 ",
        dead: true,
        commitVerified: true
      },
      {
        usage: 13,
        modifiers: 6,
        glyph: "\u2122",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 0,
        glyph: "s",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 2,
        glyph: "S",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 4,
        glyph: "\u2423",
        dead: true,
        commitVerified: true
      },
      {
        usage: 14,
        modifiers: 6,
        glyph: "\u017F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 0,
        glyph: "r",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 2,
        glyph: "R",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 4,
        glyph: "\u02D8",
        dead: true,
        commitVerified: true
      },
      {
        usage: 15,
        modifiers: 6,
        glyph: "\xAE",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 0,
        glyph: "q",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 2,
        glyph: "Q",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 4,
        glyph: "\xB0",
        dead: true,
        commitVerified: true
      },
      {
        usage: 16,
        modifiers: 6,
        glyph: "\u031B ",
        dead: true,
        commitVerified: true
      },
      {
        usage: 17,
        modifiers: 0,
        glyph: "\u2019",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 2,
        glyph: "?",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 4,
        glyph: "\xBF",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 6,
        glyph: "\u0309 ",
        dead: true,
        commitVerified: true
      },
      {
        usage: 18,
        modifiers: 0,
        glyph: "l",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 2,
        glyph: "L",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 4,
        glyph: "/",
        dead: true,
        commitVerified: true
      },
      {
        usage: 18,
        modifiers: 6,
        glyph: "\xA3",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 0,
        glyph: "j",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 2,
        glyph: "J",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 4,
        glyph: "\u262E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 6,
        glyph: "\u262F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 0,
        glyph: "b",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 2,
        glyph: "B",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 4,
        glyph: "|",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 6,
        glyph: "_",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 0,
        glyph: "o",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 2,
        glyph: "O",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 4,
        glyph: "\u0153",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 6,
        glyph: "\u0152",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 0,
        glyph: "u",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 2,
        glyph: "U",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 4,
        glyph: "\xF9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 6,
        glyph: "\xD9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 0,
        glyph: "\xE8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 2,
        glyph: "\xC8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 4,
        glyph: "`",
        dead: true,
        commitVerified: true
      },
      {
        usage: 23,
        modifiers: 6,
        glyph: "`",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 0,
        glyph: "v",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 2,
        glyph: "V",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 4,
        glyph: "\u02C7",
        dead: true,
        commitVerified: true
      },
      {
        usage: 24,
        modifiers: 6,
        glyph: "\u2622",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 0,
        glyph: ".",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 2,
        glyph: ":",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 4,
        glyph: "\u2026",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 6,
        glyph: "\xB7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 0,
        glyph: "\xE9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 2,
        glyph: "\xC9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 4,
        glyph: "\xB4",
        dead: true,
        commitVerified: true
      },
      {
        usage: 26,
        modifiers: 6,
        glyph: "\u2665",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 0,
        glyph: "y",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 2,
        glyph: "Y",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 4,
        glyph: "{",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 6,
        glyph: "\u2018",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 0,
        glyph: "^",
        dead: true,
        commitVerified: true
      },
      {
        usage: 28,
        modifiers: 2,
        glyph: "!",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 4,
        glyph: "\xA1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 6,
        glyph: "\u2620",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 0,
        glyph: "\xE0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 2,
        glyph: "\xC0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 4,
        glyph: "\\",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 6,
        glyph: "\u201A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 0,
        glyph: '"',
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 2,
        glyph: "1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 4,
        glyph: "\u2014",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 6,
        glyph: "\u201E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 0,
        glyph: "\xAB",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 2,
        glyph: "2",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 4,
        glyph: "<",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 6,
        glyph: "\u201C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 0,
        glyph: "\xBB",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 2,
        glyph: "3",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 4,
        glyph: ">",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 6,
        glyph: "\u201D",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 0,
        glyph: "(",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 2,
        glyph: "4",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 4,
        glyph: "[",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 6,
        glyph: "\u2A7D",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 0,
        glyph: ")",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 2,
        glyph: "5",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 4,
        glyph: "]",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 6,
        glyph: "\u2A7E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 0,
        glyph: "@",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 2,
        glyph: "6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 4,
        glyph: "^",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 6,
        glyph: "\u26A0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 0,
        glyph: "+",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 2,
        glyph: "7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 4,
        glyph: "\xB1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 6,
        glyph: "\xAC",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 0,
        glyph: "-",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 2,
        glyph: "8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 4,
        glyph: "\u2212",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 6,
        glyph: "\xBC",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 0,
        glyph: "/",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 2,
        glyph: "9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 4,
        glyph: "\xF7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 6,
        glyph: "\xBD",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 0,
        glyph: "*",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 2,
        glyph: "0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 4,
        glyph: "\xD7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 6,
        glyph: "\xBE",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 0,
        glyph: " ",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 2,
        glyph: "\u202F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 4,
        glyph: "_",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 6,
        glyph: "\xA0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 0,
        glyph: "=",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 2,
        glyph: "\xB0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 4,
        glyph: "\u2260",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 6,
        glyph: "\u2032",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 0,
        glyph: "%",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 2,
        glyph: "`",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 4,
        glyph: "\u2030",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 6,
        glyph: "\u2033",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 0,
        glyph: "z",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 2,
        glyph: "Z",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 4,
        glyph: "-",
        dead: true,
        commitVerified: true
      },
      {
        usage: 47,
        modifiers: 6,
        glyph: "\u2619",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 0,
        glyph: "w",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 2,
        glyph: "W",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 4,
        glyph: "\u269C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 6,
        glyph: "\u267F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 0,
        glyph: "\xE7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 2,
        glyph: "\xC7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 4,
        glyph: "\u2708",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 6,
        glyph: "\u{1F12F}",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 0,
        glyph: "n",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 2,
        glyph: "N",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 4,
        glyph: "~",
        dead: true,
        commitVerified: true
      },
      {
        usage: 51,
        modifiers: 6,
        glyph: "\u2693",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 0,
        glyph: "m",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 2,
        glyph: "M",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 4,
        glyph: "\xAF",
        dead: true,
        commitVerified: true
      },
      {
        usage: 52,
        modifiers: 6,
        glyph: "\u26FD",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 0,
        glyph: "$",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 2,
        glyph: "#",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 4,
        glyph: "\u2013",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 6,
        glyph: "\xB6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 0,
        glyph: "g",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 2,
        glyph: "G",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 4,
        glyph: "\xB5",
        dead: true,
        commitVerified: true
      },
      {
        usage: 54,
        modifiers: 6,
        glyph: "\u2020",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 0,
        glyph: "h",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 2,
        glyph: "H",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 4,
        glyph: ". ",
        dead: true,
        commitVerified: true
      },
      {
        usage: 55,
        modifiers: 6,
        glyph: "\u2021",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 0,
        glyph: "f",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 2,
        glyph: "F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 4,
        glyph: "\u02DB",
        dead: true,
        commitVerified: true
      },
      {
        usage: 56,
        modifiers: 6,
        glyph: "\u26C4",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 0,
        glyph: "\xEA",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 2,
        glyph: "\xCA",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 4,
        glyph: "/",
        dead: false,
        commitVerified: false
      },
      {
        usage: 100,
        modifiers: 6,
        glyph: "^",
        dead: false,
        commitVerified: false
      }
    ],
    recipes: [
      {
        glyph: "\xE4",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC4",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEF",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 7,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCF",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 7,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEB",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 9,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCB",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 9,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xF6",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 21,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xD6",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 21,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xFC",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 22,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xDC",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 22,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xFF",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 27,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\u0178",
        steps: [
          {
            usage: 7,
            modifiers: 4
          },
          {
            usage: 27,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE7",
        steps: [
          {
            usage: 11,
            modifiers: 4
          },
          {
            usage: 11,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC7",
        steps: [
          {
            usage: 11,
            modifiers: 4
          },
          {
            usage: 11,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE0",
        steps: [
          {
            usage: 23,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC0",
        steps: [
          {
            usage: 23,
            modifiers: 4
          },
          {
            usage: 4,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE8",
        steps: [
          {
            usage: 23,
            modifiers: 4
          },
          {
            usage: 9,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC8",
        steps: [
          {
            usage: 23,
            modifiers: 4
          },
          {
            usage: 9,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xF9",
        steps: [
          {
            usage: 23,
            modifiers: 4
          },
          {
            usage: 22,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xD9",
        steps: [
          {
            usage: 23,
            modifiers: 4
          },
          {
            usage: 22,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE9",
        steps: [
          {
            usage: 26,
            modifiers: 4
          },
          {
            usage: 9,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC9",
        steps: [
          {
            usage: 26,
            modifiers: 4
          },
          {
            usage: 9,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xE2",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 4,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xC2",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 4,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEE",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 7,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCE",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 7,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xEA",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 9,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xCA",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 9,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xF4",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 21,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xD4",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 21,
            modifiers: 2
          }
        ]
      },
      {
        glyph: "\xFB",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 22,
            modifiers: 0
          }
        ]
      },
      {
        glyph: "\xDB",
        steps: [
          {
            usage: 28,
            modifiers: 0
          },
          {
            usage: 22,
            modifiers: 2
          }
        ]
      }
    ]
  },
  isrt: {
    name: "Original ISRT 2021-01-27, ANSI",
    sha256: "98b3df21a2cb9a131933d3e4fe5fc6f3179e4bcff43d7cbf1c9d5e858a48b737",
    outputs: [
      {
        usage: 53,
        modifiers: 0,
        glyph: "`",
        dead: false,
        commitVerified: false
      },
      {
        usage: 53,
        modifiers: 2,
        glyph: "~",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 0,
        glyph: "1",
        dead: false,
        commitVerified: false
      },
      {
        usage: 30,
        modifiers: 2,
        glyph: "!",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 0,
        glyph: "2",
        dead: false,
        commitVerified: false
      },
      {
        usage: 31,
        modifiers: 2,
        glyph: "@",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 0,
        glyph: "3",
        dead: false,
        commitVerified: false
      },
      {
        usage: 32,
        modifiers: 2,
        glyph: "#",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 0,
        glyph: "4",
        dead: false,
        commitVerified: false
      },
      {
        usage: 33,
        modifiers: 2,
        glyph: "$",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 0,
        glyph: "5",
        dead: false,
        commitVerified: false
      },
      {
        usage: 34,
        modifiers: 2,
        glyph: "%",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 0,
        glyph: "6",
        dead: false,
        commitVerified: false
      },
      {
        usage: 35,
        modifiers: 2,
        glyph: "^",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 0,
        glyph: "7",
        dead: false,
        commitVerified: false
      },
      {
        usage: 36,
        modifiers: 2,
        glyph: "&",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 0,
        glyph: "8",
        dead: false,
        commitVerified: false
      },
      {
        usage: 37,
        modifiers: 2,
        glyph: "*",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 0,
        glyph: "9",
        dead: false,
        commitVerified: false
      },
      {
        usage: 38,
        modifiers: 2,
        glyph: "(",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 0,
        glyph: "0",
        dead: false,
        commitVerified: false
      },
      {
        usage: 39,
        modifiers: 2,
        glyph: ")",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 0,
        glyph: "-",
        dead: false,
        commitVerified: false
      },
      {
        usage: 45,
        modifiers: 2,
        glyph: "_",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 0,
        glyph: "=",
        dead: false,
        commitVerified: false
      },
      {
        usage: 46,
        modifiers: 2,
        glyph: "+",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 0,
        glyph: "y",
        dead: false,
        commitVerified: false
      },
      {
        usage: 20,
        modifiers: 2,
        glyph: "Y",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 0,
        glyph: "c",
        dead: false,
        commitVerified: false
      },
      {
        usage: 26,
        modifiers: 2,
        glyph: "C",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 0,
        glyph: "l",
        dead: false,
        commitVerified: false
      },
      {
        usage: 8,
        modifiers: 2,
        glyph: "L",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 0,
        glyph: "m",
        dead: false,
        commitVerified: false
      },
      {
        usage: 21,
        modifiers: 2,
        glyph: "M",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 0,
        glyph: "k",
        dead: false,
        commitVerified: false
      },
      {
        usage: 23,
        modifiers: 2,
        glyph: "K",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 0,
        glyph: "z",
        dead: false,
        commitVerified: false
      },
      {
        usage: 28,
        modifiers: 2,
        glyph: "Z",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 0,
        glyph: "f",
        dead: false,
        commitVerified: false
      },
      {
        usage: 24,
        modifiers: 2,
        glyph: "F",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 0,
        glyph: "u",
        dead: false,
        commitVerified: false
      },
      {
        usage: 12,
        modifiers: 2,
        glyph: "U",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 0,
        glyph: ",",
        dead: false,
        commitVerified: false
      },
      {
        usage: 18,
        modifiers: 2,
        glyph: "<",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 0,
        glyph: "'",
        dead: false,
        commitVerified: false
      },
      {
        usage: 19,
        modifiers: 2,
        glyph: '"',
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 0,
        glyph: "[",
        dead: false,
        commitVerified: false
      },
      {
        usage: 47,
        modifiers: 2,
        glyph: "{",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 0,
        glyph: "]",
        dead: false,
        commitVerified: false
      },
      {
        usage: 48,
        modifiers: 2,
        glyph: "}",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 0,
        glyph: "\\",
        dead: false,
        commitVerified: false
      },
      {
        usage: 49,
        modifiers: 2,
        glyph: "|",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 0,
        glyph: "i",
        dead: false,
        commitVerified: false
      },
      {
        usage: 4,
        modifiers: 2,
        glyph: "I",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 0,
        glyph: "s",
        dead: false,
        commitVerified: false
      },
      {
        usage: 22,
        modifiers: 2,
        glyph: "S",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 0,
        glyph: "r",
        dead: false,
        commitVerified: false
      },
      {
        usage: 7,
        modifiers: 2,
        glyph: "R",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 0,
        glyph: "t",
        dead: false,
        commitVerified: false
      },
      {
        usage: 9,
        modifiers: 2,
        glyph: "T",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 0,
        glyph: "g",
        dead: false,
        commitVerified: false
      },
      {
        usage: 10,
        modifiers: 2,
        glyph: "G",
        dead: false,
        commitVerified: false
      },
      {
        usage: 11,
        modifiers: 0,
        glyph: "p",
        dead: false,
        commitVerified: false
      },
      {
        usage: 11,
        modifiers: 2,
        glyph: "P",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 0,
        glyph: "n",
        dead: false,
        commitVerified: false
      },
      {
        usage: 13,
        modifiers: 2,
        glyph: "N",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 0,
        glyph: "e",
        dead: false,
        commitVerified: false
      },
      {
        usage: 14,
        modifiers: 2,
        glyph: "E",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 0,
        glyph: "a",
        dead: false,
        commitVerified: false
      },
      {
        usage: 15,
        modifiers: 2,
        glyph: "A",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 0,
        glyph: "o",
        dead: false,
        commitVerified: false
      },
      {
        usage: 51,
        modifiers: 2,
        glyph: "O",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 0,
        glyph: ";",
        dead: false,
        commitVerified: false
      },
      {
        usage: 52,
        modifiers: 2,
        glyph: ":",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 0,
        glyph: "q",
        dead: false,
        commitVerified: false
      },
      {
        usage: 29,
        modifiers: 2,
        glyph: "Q",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 0,
        glyph: "v",
        dead: false,
        commitVerified: false
      },
      {
        usage: 27,
        modifiers: 2,
        glyph: "V",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 0,
        glyph: "w",
        dead: false,
        commitVerified: false
      },
      {
        usage: 6,
        modifiers: 2,
        glyph: "W",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 0,
        glyph: "d",
        dead: false,
        commitVerified: false
      },
      {
        usage: 25,
        modifiers: 2,
        glyph: "D",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 0,
        glyph: "j",
        dead: false,
        commitVerified: false
      },
      {
        usage: 5,
        modifiers: 2,
        glyph: "J",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 0,
        glyph: "b",
        dead: false,
        commitVerified: false
      },
      {
        usage: 17,
        modifiers: 2,
        glyph: "B",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 0,
        glyph: "h",
        dead: false,
        commitVerified: false
      },
      {
        usage: 16,
        modifiers: 2,
        glyph: "H",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 0,
        glyph: "/",
        dead: false,
        commitVerified: false
      },
      {
        usage: 54,
        modifiers: 2,
        glyph: "?",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 0,
        glyph: ".",
        dead: false,
        commitVerified: false
      },
      {
        usage: 55,
        modifiers: 2,
        glyph: ">",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 0,
        glyph: "x",
        dead: false,
        commitVerified: false
      },
      {
        usage: 56,
        modifiers: 2,
        glyph: "X",
        dead: false,
        commitVerified: false
      },
      {
        usage: 44,
        modifiers: 0,
        glyph: " ",
        dead: false,
        commitVerified: false
      }
    ],
    recipes: []
  }
};

// src/projection/catalogue.ts
function entry(metadata, build) {
  try {
    const profile = build();
    if (new Set(profile.keys.map((key) => key.id)).size !== profile.keys.length)
      throw new Error("Duplicate physical key");
    return { ...metadata, status: "available", profile };
  } catch (error) {
    return { ...metadata, status: "unavailable", reason: error instanceof Error ? error.message : "Profile validation failed" };
  }
}
var targetRegistry = [
  entry({
    id: "qwerty",
    label: "QWERTY",
    reference: "macOS US \xB7 ANSI",
    provenance: `${profileProvenance.os} \xB7 UCKeyTranslate`,
    sourceUrl: "https://support.apple.com/guide/mac-help/use-the-keyboard-viewer-mchlp1015/mac",
    notes: "Existing macOS US definition, not US International."
  }, () => createNativeTarget("us")),
  entry({
    id: "azerty",
    label: "AZERTY",
    reference: "macOS French \xB7 ISO",
    provenance: `${profileProvenance.os} \xB7 UCKeyTranslate`,
    sourceUrl: "https://support.apple.com/guide/mac-help/use-the-keyboard-viewer-mchlp1015/mac",
    notes: "Existing macOS French definition, not French Numerical."
  }, () => createNativeTarget("french")),
  entry(
    {
      id: "colemak-dh",
      label: "Colemak-DH",
      reference: "macOS ABC Extended \xB7 ISO \xB7 Angle fingering",
      provenance: `ColemakMods/mod-dh d9398d57695089658841f3dc62827ae814aef8c4 \xB7 SHA-256 ${additional_layouts_default.colemak.sha256}`,
      sourceUrl: "https://github.com/ColemakMods/mod-dh/tree/d9398d57695089658841f3dc62827ae814aef8c4/macOS",
      notes: "Published ISO Extended mapping, with documented Angle fingering for Z/X/C/D. No Wide, DHk, Fat-Z or Caps remap."
    },
    () => createProfile("macos-colemak-dh-iso-extended-v1", "Colemak-DH \xB7 ISO Extended", additional_layouts_default.colemak.outputs, true, additional_layouts_default.colemak.recipes, true)
  ),
  entry(
    {
      id: "bepo",
      label: "B\xE9po",
      reference: "macOS B\xE9po 1.1rc2 \xB7 ISO \xB7 plain shortcuts",
      provenance: `Official 1.1rc2 bundle, bepo.keylayout \xB7 SHA-256 ${additional_layouts_default.bepo.sha256}`,
      sourceUrl: "https://bepo.fr/wiki/MacOS",
      notes: "Plain B\xE9po, not an AZERTY/QWERTY Command variant. Curly and straight apostrophes remain distinct."
    },
    () => createProfile("macos-bepo-1.1rc2-iso-v1", "B\xE9po \xB7 ISO 1.1rc2", additional_layouts_default.bepo.outputs, true, additional_layouts_default.bepo.recipes)
  ),
  entry(
    {
      id: "isrt",
      label: "ISRT",
      reference: "Original 2021-01-27 \xB7 ANSI \xB7 verified base/Shift only",
      provenance: `Original arrangement corroborated with DreymaR's history and Keyboard-Design ANSI data \xB7 SHA-256 ${additional_layouts_default.isrt.sha256}`,
      sourceUrl: "https://www.keyboard-design.com/letterlayout.html?layout=isrt.en.ansi",
      notes: "No Angle/Wide/Sym adaptations. Option levels are unpublished/unverified and remain unsupported; no QWERTY hybrid. Original author's former page is unavailable."
    },
    () => createProfile("isrt-2021-01-27-ansi-v1", "ISRT \xB7 original ANSI", additional_layouts_default.isrt.outputs, false)
  )
];
var defaultTargetId = "azerty";
var targetProfiles = targetRegistry.flatMap((entry2) => entry2.status === "available" ? [entry2.profile] : []);
var usProfile = targetProfiles.find((profile) => profile.id === "macos-us-ansi-v1");
function computeCatalogue(source, registry = targetRegistry, compute = project) {
  return Object.fromEntries(registry.map((target) => {
    if (target.status === "unavailable")
      return [target.id, { status: "unavailable", reason: target.reason }];
    try {
      return [target.id, { status: "ready", result: compute(source, frenchProfile, target.profile) }];
    } catch (error) {
      return [target.id, { status: "error", reason: error instanceof Error ? error.message : "Target projection failed" }];
    }
  }));
}
function successfulResults(results) {
  return Object.values(results).flatMap((outcome) => outcome.status === "ready" ? [outcome.result] : []);
}
function initialTarget(remembered, results, registry = targetRegistry) {
  const usable = (id) => registry.some((entry2) => entry2.id === id) && results[id]?.status === "ready";
  return [remembered, defaultTargetId, "qwerty", ...registry.map((entry2) => entry2.id)].find((id) => !!id && usable(id)) || null;
}
export {
  compositionCharacters,
  computeCatalogue,
  createNativeTarget,
  createProfile,
  customGlyphAliases,
  decode,
  defaultTargetId,
  frenchProfile,
  initialTarget,
  isPrintingAction,
  keyId,
  mergeObservedLayers,
  modifierFamilies,
  observedUsage,
  printingOnly,
  profileProvenance,
  project,
  projectedUsage,
  successfulResults,
  targetProfiles,
  targetRegistry,
  textModifiers,
  usProfile
};
