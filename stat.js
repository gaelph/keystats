import keycodes from "./keycodes.js";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("./data/log.json"));

const layerUsage = Object.values(data.codesPressed).reduce(
  (sums, d) => {
    const c = parseInt(d.keycode, 16);
    const m = parseInt(d.modifiers, 16);

    if (keycodes.isLayerTap(c)) {
      const ll = keycodes.getLayerTap(c);
    }
  },
  {
    layer0: 0, // key that activates the layer 0
    layer1: 0, // key that activates the layer 1
    layer2: 0, // key that activates the layer 2
    layer3: 0, // key that activates the layer 3
    layer4: 0, // key that activates the layer 4
    space: 0,
    shiftedSpace: 0,
    enter: 0,
    shiftedEnter: 0,
    escape: 0,
    shiftedEscape: 0,
  }
);

const modifierUsage = Object.values(data.codesPressed).reduce(
  (sums, d) => {
    const c = parseInt(d.keycode, 16);
    const m = parseInt(d.modifiers, 16);

    // Is one of the home row mods
    if (keycodes.isModTap(c)) {
      const mm = keycodes.getModTap(c) << 8;
      const mod = keycodes.modifiers[mm];
      if (!mod) {
        console.log(mm, "is not a modifier");
        return sums;
      }
      // counts the totals of presses for each,
      // but could be as a modifier or as a letter key
      if (m === 0) {
        switch (mod) {
          case "lctrl":
            sums.a += d.count;
            break;
          case "rctrl":
            sums.u += d.count;
            break;
          case "lalt":
            sums.s += d.count;
            break;
          case "ralt":
            sums.i += d.count;
            break;
          case "lcmd":
            sums.r += d.count;
            break;
          case "rcmd":
            sums.e += d.count;
            break;
        }
      }
      const { lctrl, lalt, lcmd, lshft, rctrl, ralt, rcmd, rshft } =
        keycodes.getModifiers(m);
      if (keycodes.isShifted(d.modifiers)) {
        switch (mod) {
          case "lctrl":
            sums.A +=
              (lshft || rshft) && !rctrl && !lcmd && !rcmd ? d.count : 0;
            break;
          case "rctrl":
            sums.U +=
              (lshft || rshft) && !lctrl && !lcmd && !rcmd ? d.count : 0;
            break;
          case "lalt":
            sums.S +=
              (lshft || rshft) && !lctrl && !rctrl && !ralt && !lcmd && !rcmd
                ? d.count
                : 0;
            break;
          case "ralt":
            sums.I +=
              (lshft || rshft) && !lctrl && !rctrl && !lalt && !lcmd && !rcmd
                ? d.count
                : 0;
            break;
          case "lcmd":
            sums.R +=
              (lshft || rshft) && !lctrl && !rctrl && !lalt && !ralt && !rcmd
                ? d.count
                : 0;
            break;
          case "rcmd":
            sums.E +=
              (lshft || rshft) && !lctrl && !rctrl && !lalt && !ralt && !lcmd
                ? d.count
                : 0;
            break;
        }
      }
    }
    // counts total presses of keys that are not home row mods
    // but were pressed with modifiers
    else if (m !== 0) {
      const modi = keycodes.getModifiers(m);
      Object.entries(modi).forEach(([key, value]) => {
        sums[key] += value;
      });
    }
    return sums;
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
    a: 0,
    u: 0,
    s: 0,
    i: 0,
    r: 0,
    e: 0,
    A: 0,
    U: 0,
    S: 0,
    I: 0,
    R: 0,
    E: 0,
  }
);

const totals = Object.entries(data.codesPressed).reduce((sums, [code, d]) => {
  d.modifiers =
    parseInt(d.modifiers, 16) | ((parseInt(d.keycode, 16) & 0x1fff) >> 8);
  d.modifiers = d.modifiers.toString(16);
  let c = parseInt(d.keycode, 16);

  if (keycodes.keycodes.specials[c]) {
    sums[keycodes.keycodes.specials[c]] = d.count;
    return sums;
  }
  if (d.modifiers == 0 && !keycodes.isModTap(c)) {
    const l = keycodes.keycodes.azerty[c];
    if (l !== undefined) {
      sums[l] = (sums[l] || 0) + d.count;
    }
  } else if (
    keycodes.isShifted(d.modifiers) &&
    !keycodes.isAlted(d.modifiers) &&
    !keycodes.isCtrl(d.modifiers) &&
    !keycodes.isCmd(d.modifiers) &&
    !keycodes.isModTap(c)
  ) {
    const basic = keycodes.getBasic(c);
    let l = keycodes.keycodes.azertyShift[basic];
    if (l !== undefined) {
      sums[l] = (sums[l] || 0) + d.count;
    }
  } else if (
    keycodes.isAlted(d.modifiers) &&
    !keycodes.isShifted(d.modifiers) &&
    !keycodes.isCtrl(d.modifiers) &&
    !keycodes.isCmd(d.modifiers) &&
    !keycodes.isModTap(c)
  ) {
    const basic = keycodes.getBasic(c);
    let l = keycodes.keycodes.azertyAlt[basic];
    if (l !== undefined) {
      sums[l] = (sums[l] || 0) + d.count;
    }
  } else if (
    keycodes.isAlted(d.modifiers) &&
    keycodes.isShifted(d.modifiers) &&
    !keycodes.isCtrl(d.modifiers) &&
    !keycodes.isCmd(d.modifiers) &&
    !keycodes.isModTap(c)
  ) {
    const basic = keycodes.getBasic(c);
    let l = keycodes.keycodes.azertyShiftAlt[basic];
    if (l !== undefined) {
      sums[l] = (sums[l] || 0) + d.count;
    }
  }
  return sums;
}, {});

totals.a = modifierUsage.a - modifierUsage.lctrl;
totals.s = modifierUsage.s - modifierUsage.lalt;
totals.r = modifierUsage.r - modifierUsage.lcmd;
totals.u = modifierUsage.u - modifierUsage.rctrl;
totals.i = modifierUsage.i - modifierUsage.ralt;
totals.e = modifierUsage.e - modifierUsage.rcmd;

totals.A = modifierUsage.A;
totals.S = modifierUsage.S;
totals.R = modifierUsage.R;
totals.U = modifierUsage.U;
totals.I = modifierUsage.I;
totals.E = modifierUsage.E;

const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);

let total = 0;
for (let [_, count] of ranked) {
  total += count;
}
console.log("TOTAL:", total);
for (let [char, count] of ranked) {
  const percent = ((100 * count) / total).toFixed(2);

  console.log(`${char}: ${percent}%`);
}
