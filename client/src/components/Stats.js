import { useCallback, useMemo } from "react";
import { computeTotals } from "../lib/stat.js";

import {
  getTotalKeyPresses,
  getTotalsByHand,
  getTotalsByFinger,
  getTotalByRow,
} from "../lib/sums.js";
import { Tabs, Tab } from "./Tabs.js";

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

const p = (v, total) => ((100 * v) / total).toFixed(2);

export default function StatsComponent({
  counts: layers,
  handAndFingerUsage,
  characters,
}) {
  const [freqTotal, freqTotals] = computeTotals(characters || {});
  const usableLayers = useMemo(() => {
    if (!layers) {
      return {};
    }
    return Object.entries(layers)
      .filter(([key]) => parseInt(key || 0, 10) < 6)
      .reduce((acc, [key, value]) => {
        acc[key] = value || 0;
        return acc;
      }, {});
  }, [layers]);

  const totalKeypresses = useMemo(
    () => getTotalKeyPresses(usableLayers),
    [usableLayers],
  );

  const percent = useCallback(
    (v) => {
      return ((100 * v) / totalKeypresses.total).toFixed(2);
    },
    [totalKeypresses.total],
  );

  const hand = useMemo(() => getTotalsByHand(usableLayers), [usableLayers]);
  const finger = useMemo(() => getTotalsByFinger(usableLayers), [usableLayers]);
  const row = useMemo(() => getTotalByRow(usableLayers), [usableLayers]);

  const fingerUsage = handAndFingerUsage?.fingerUsage;
  const fingerUsageSumPerFinger = useMemo(() => {
    return fingerUsage?.map((counts) => {
      return counts.reduce((acc, usage) => acc + usage, 0);
    });
  }, [fingerUsage]);
  const handUsage = handAndFingerUsage?.handUsage;
  const handUsageSumPerHand = useMemo(() => {
    return handUsage?.map((counts) => {
      return counts.reduce((acc, usage) => acc + usage, 0);
    });
  }, [handUsage]);

  return (
    <Tabs>
      <Tab title="Keypress Statistics">
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
          {fingerUsage && (
            <>
              <h4>Same finger Use</h4>
              <p>
                Includes double letters (as in “ll”), repetively typing on the
                same key (e.g. “backspace”), etc.
                <br />
                Counts below 1% are discarded.
              </p>
              <ul>
                {fingerUsage.map((f, idx) => (
                  <li key={`same-finger-use-${idx}`}>
                    <h5>{FINGER_NAMES[idx]}</h5>
                    <ul>
                      {f.map(
                        (count, ntimes) =>
                          parseFloat(
                            p(count || 0, fingerUsageSumPerFinger[idx]),
                          ) >= 1 &&
                          ntimes >= 2 && (
                            <li key={`same-finger-use-${idx}-${ntimes}`}>
                              <span>
                                <strong>Used {ntimes} times in a row:</strong>
                              </span>{" "}
                              <span>
                                {p(count, fingerUsageSumPerFinger[idx])}%
                              </span>
                            </li>
                          ),
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
          {handUsage && (
            <>
              <h4>Same hand usage</h4>
              <p>
                Includes double letters (as in “ll”), repetively typing on the
                same key (e.g. “backspace”), etc.
                <br />
                Using modifiers combinations (e.g. Ctrl+Alt+Shift, with all
                modifiers pressed with the same hand, counts as 3 presses in row
                for that hand).
                <br />
                Counts below 2% are discarded.
              </p>
              <ul>
                <li>
                  <h5>Left Hand</h5>
                  <ul>
                    {handUsage[0].map(
                      (count, ntimes) =>
                        parseFloat(p(count || 0, handUsageSumPerHand[0])) >=
                          2 &&
                        ntimes >= 2 && (
                          <li key={`left_hand_same_use_${ntimes}_${count}`}>
                            <span>
                              <strong>Used {ntimes} times in a row:</strong>
                            </span>{" "}
                            <span>
                              {p(count || 0, handUsageSumPerHand[0])}%
                            </span>
                          </li>
                        ),
                    )}
                  </ul>
                </li>
                <li>
                  <h5>Right Hand</h5>
                  <ul>
                    {Object.entries(handUsage[1]).map(
                      ([ntimes, count], idx) =>
                        parseFloat(
                          percent(count || 0, handUsageSumPerHand[1]),
                        ) >= 2 &&
                        ntimes >= 2 && (
                          <li key={`right_hand_same_use_${idx}`}>
                            <span>
                              <strong>Used {ntimes} times in a row:</strong>
                            </span>{" "}
                            <span>
                              {p(count || 0, handUsageSumPerHand[1])}%
                            </span>
                          </li>
                        ),
                    )}
                  </ul>
                </li>
              </ul>
            </>
          )}
        </div>
      </Tab>
      <Tab title="Character Statistics">
        <div>
          <h3>Total characters entered: {formatNumber(freqTotal)}</h3>
          <table>
            <thead></thead>
            <tbody>
              {freqTotals.map(([char, count]) => {
                return (
                  <tr title={`Entered ${count} times`}>
                    <th>{char}</th>
                    <td>{((100 * count) / freqTotal).toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Tab>
    </Tabs>
  );
}
