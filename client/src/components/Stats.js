import { useCallback, useMemo } from "react";

import {
  getTotalKeyPresses,
  getTotalsByHand,
  getTotalsByFinger,
  getTotalByRow,
} from "../lib/sums.js";

const numberFormater = new Intl.NumberFormat("en-US", {});
function formatNumber(n) {
  return numberFormater.format(n);
}

const FINGER_NAMES = [
  "Left pinkie",
  "Left ring",
  "Left middle",
  "Left index",
  "Left thumb",
  "Right thumb",
  "Right index",
  "Right middle",
  "Right ring",
  "Right pinkie",
];

const ROW_NAMES = ["Top row", "Home row", "Bottom row", "Thumb row"];

export default function StatsComponent({
  data: { layers, pressedData, handUsage },
}) {
  const usableLayers = useMemo(() => {
    return Object.entries(layers)
      .filter(([key]) => parseInt(key, 10) < 6)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }, [layers]);

  const totalKeypresses = useMemo(
    () => getTotalKeyPresses(usableLayers),
    [usableLayers]
  );

  const percent = useCallback(
    (v) => {
      return ((100 * v) / totalKeypresses.total).toFixed(2);
    },
    [totalKeypresses.total]
  );

  const hand = useMemo(() => getTotalsByHand(usableLayers), [usableLayers]);
  const finger = useMemo(() => getTotalsByFinger(usableLayers), [usableLayers]);
  const row = useMemo(() => getTotalByRow(usableLayers), [usableLayers]);

  return (
    <div>
      <h3>Total key presses: {formatNumber(totalKeypresses.total)}</h3>
      <p>
        All key presses are counted, including keyboard shortcuts (such as
        Ctrl+Alt+Shift+A, that counts as 4 presses), repetitively typing the
        same key, etc.
      </p>
      <h4>Layer usage</h4>
      <ul>
        {Object.entries(totalKeypresses.byLayer).map(([key, value]) => (
          <li key={`keypress-layer-${key}`}>
            <span>
              <strong>Layer #{key}:</strong>{" "}
            </span>
            <span>{percent(value)}%</span>
          </li>
        ))}
      </ul>
      <h4>Row usage</h4>
      <ul>
        {ROW_NAMES.map((name, idx) => (
          <li key={name}>
            <span>
              <strong>{name}:</strong>{" "}
            </span>
            <span>{percent(row[idx])}%</span>
          </li>
        ))}
      </ul>
      <h4>Hand usage</h4>
      <ul>
        <li>
          <span>
            <strong>Left:</strong> {percent(hand.left)}%
          </span>
        </li>
        <li>
          <span>
            <strong>Right:</strong> {percent(hand.right)}%
          </span>
        </li>
      </ul>
      <h4>Finger usage</h4>
      <ul>
        {FINGER_NAMES.map((name, idx) => (
          <li key={name}>
            <span>
              <strong>{name}:</strong> {percent(finger[idx])}%
            </span>
          </li>
        ))}
      </ul>
      {handUsage && (
        <>
          <h4>Same hand usage</h4>
          <p>
            Includes double letters (as in “ll”), repetively typing on the same
            key (e.g. “backspace”), etc.
            <br />
            Using modifiers combinations (e.g. Ctrl+Alt+Shift, with all
            modifiers pressed with the same hand, counts as 3 presses in row for
            that hand).
            <br />
            Counts below 2% are discarded.
          </p>
          <ul>
            <li>
              <h5>Left Hand</h5>
              <ul>
                {Object.entries(handUsage[0]).map(
                  ([ntimes, count], idx) =>
                    parseFloat(percent(count)) >= 2 && (
                      <li key={`left_hand_same_use`}>
                        <span>
                          <strong>Used {ntimes} times in a row:</strong>
                        </span>{" "}
                        <span>{percent(count)}%</span>
                      </li>
                    )
                )}
              </ul>
            </li>
            <li>
              <h5>Right Hand</h5>
              <ul>
                {Object.entries(handUsage[1]).map(
                  ([ntimes, count], idx) =>
                    parseFloat(percent(count)) >= 2 && (
                      <li key={`left_hand_same_use`}>
                        <span>
                          <strong>Used {ntimes} times in a row:</strong>
                        </span>{" "}
                        <span>{percent(count)}%</span>
                      </li>
                    )
                )}
              </ul>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
