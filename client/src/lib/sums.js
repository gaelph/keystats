const LEFT_COLUMNS = [0, 1, 2, 3, 4, 5];
// const RIGHT_COLUMNS = [6, 7, 8, 9, 10, 11];

export function getTotalKeyPresses(layers) {
  const totals = { total: 0, byLayer: {} };

  Object.entries(layers).forEach(([key, layer]) => {
    if (layer) {
      const t = layer.reduce((acc, row) => {
        const tr = (row || []).reduce((rowacc, x) => rowacc + (x || 0), 0);
        return acc + tr;
      }, 0);

      totals.total += t;
      totals.byLayer[key] = t;
    }
  });

  return totals;
}

export function getTotalByRow(layers) {
  const totals = new Array(4).fill(0);

  Object.values(layers).forEach((layer) => {
    if (layer) {
      layer.forEach((row, rowidx) => {
        const tr = (row || []).reduce((rowacc, x) => rowacc + x, 0);

        totals[rowidx] += tr;
      });
    }
  });

  return totals;
}

export function getTotalsByHand(layers) {
  const totals = { left: 0, right: 0, byLayer: {} };

  Object.entries(layers).forEach(([key, layer]) => {
    if (layer) {
      const t = layer.reduce(
        (acc, row) => {
          const tr = (row || []).reduce(
            (rowacc, x, colidx) => {
              if (LEFT_COLUMNS.includes(colidx)) {
                rowacc.left += x;
              } else {
                rowacc.right += x;
              }
              return rowacc;
            },
            { left: 0, right: 0 },
          );

          acc.left += tr.left;
          acc.right += tr.right;

          return acc;
        },
        { left: 0, right: 0 },
      );

      totals.left += t.left;
      totals.right += t.right;
      totals.byLayer[key] = t;
    }
  });

  return totals;
}

const LPINKIE = 0;
const LRING = 1;
const LMIDDLE = 2;
const LINDEX = 3;
const LTHUMB = 4;
const RTHUMB = 5;
const RINDEX = 6;
const RMIDDLE = 7;
const RRING = 8;
const RPINKIE = 9;

export const FINGER_MATRIX = [
  [
    LPINKIE,
    LPINKIE,
    LRING,
    LMIDDLE,
    LINDEX,
    LINDEX,
    RINDEX,
    RINDEX,
    RMIDDLE,
    RRING,
    RPINKIE,
    RPINKIE,
  ],
  [
    LPINKIE,
    LPINKIE,
    LRING,
    LMIDDLE,
    LINDEX,
    LINDEX,
    RINDEX,
    RINDEX,
    RMIDDLE,
    RRING,
    RPINKIE,
    RPINKIE,
  ],
  [
    LPINKIE,
    LPINKIE,
    LRING,
    LMIDDLE,
    LINDEX,
    LINDEX,
    RINDEX,
    RINDEX,
    RMIDDLE,
    RRING,
    RPINKIE,
    RPINKIE,
  ],
  [
    LPINKIE,
    LPINKIE,
    LRING,
    LTHUMB,
    LTHUMB,
    LTHUMB,
    RTHUMB,
    RTHUMB,
    RTHUMB,
    RRING,
    RPINKIE,
    RPINKIE,
  ],
];

/**
 * Returns the finger used to press the key at the given row and column
 * Returns null if the coordinates do not fit the matrix
 * @param {number} row
 * @param {number} col
 * @returns {number|null}
 */
export function getFingerForCoordinates(row, col) {
  if (FINGER_MATRIX[row] && FINGER_MATRIX[row][col] !== undefined) {
    return FINGER_MATRIX[row][col];
  }

  return null;
}

export function getTotalsByFinger(layers) {
  const totals = new Array(10).fill(0);

  Object.entries(layers).forEach(([_, layer]) => {
    if (layer) {
      for (let r = 0; r < layer.length; r++) {
        if (layer[r]) {
          for (let c = 0; c < layer[r].length; c++) {
            const finger = FINGER_MATRIX[r][c];
            const count = layer[r][c];

            totals[finger] += count;
          }
        }
      }
    }
  });

  return totals;
}
