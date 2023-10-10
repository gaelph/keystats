import * as keycodes from "./keycodes.js";
function sortTotals(totals) {
  const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return ranked;
}

export function computeTotals(data) {
  const totals = Object.entries(data).reduce((sums, [_code, d]) => {
    const modsToAdd = keycodes.modifierBitfieldToMaskedModifiers(d.modifiers);
    let c = parseInt(d.keycode, 16);
    c |= modsToAdd;

    const l = keycodes.formatKeyCode(c.toString(16));
    if (l !== undefined) {
      sums[l] = (sums[l] || 0) + d.counts;
    }
    if (d.keycode === "2a") {
      console.log(l, sums[l]);
    }
    return sums;
  }, {});
  let total = 0;
  for (let [_, count] of Object.entries(totals)) {
    total += count;
  }

  return [total, sortTotals(totals)];
}
