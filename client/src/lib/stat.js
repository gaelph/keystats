import * as keycodes from "./keycodes.js";
function sortTotals(totals) {
  const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return ranked;
}

export function computeTotals(data) {
  const totals = Object.entries(data).reduce((sums, [_code, d]) => {
    const modsToAdd = keycodes.modifierBitfieldToMaskedModifiers(
      parseInt(d.modifiers, 16)
    );
    // d.modifiers =
    //   parseInt(d.modifiers, 16) | ((parseInt(d.keycode, 16) & 0x1fff) >> 8);
    // d.modifiers = d.modifiers.toString(16);
    let c = parseInt(d.keycode, 16);
    c |= modsToAdd;

    // if (keycodes.isCustomKeycode(c)) {
    //   sums[keycodes.formatKeycode(d.keycode)] = d.count;
    //   return sums;
    // }

    const l = keycodes.formatKeyCode(c.toString(16));
    if (l !== undefined) {
      sums[l] = (sums[l] || 0) + d.count;
    }
    return sums;
  }, {});
  let total = 0;
  for (let [_, count] of Object.entries(totals)) {
    total += count;
  }

  return [total, sortTotals(totals)];
}
