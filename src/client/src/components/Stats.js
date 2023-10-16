import { useCallback, useMemo } from "react";
import { Tabs, Tab } from "./Tabs.js";
import IconOrChar from "./IconOrChar.js";

const numberFormater = new Intl.NumberFormat("en-US", {});
function formatNumber(n) {
  return numberFormater.format(n || 0);
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
  counts,
  handAndFingerUsage,
  characters,
}) {
  const { totalKeypresses } = counts;
  const { records, totalCharacters } = characters;

  const percent = useCallback(
    (v) => {
      if (!totalKeypresses) return 0;
      return ((100 * v) / totalKeypresses).toFixed(2);
    },
    [totalKeypresses],
  );

  const hand = { left: counts.handUsage[0], right: counts.handUsage[1] };
  const finger = counts.fingerUsage;
  const row = counts.rowUsage;
  const layer = counts.layerUsage;

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
          <h3>Total key presses: {formatNumber(totalKeypresses)}</h3>
          <p>
            All key presses are counted, including keyboard shortcuts (such as
            Ctrl+Alt+Shift+A, that counts as 4 presses), repetitively typing the
            same key, etc.
          </p>
          <h4>Layer usage</h4>
          <ul>
            {Object.entries(layer).map(([key, value]) => (
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
                Counts below 1% are discarded.
              </p>
              <ul>
                <li>
                  <h5>Left Hand</h5>
                  <ul>
                    {handUsage[0].map(
                      (count, ntimes) =>
                        parseFloat(p(count || 0, handUsageSumPerHand[0])) >=
                          1 &&
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
                        ) >= 1 &&
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
          <h3>Total characters entered: {formatNumber(totalCharacters)}</h3>
          <table>
            <thead></thead>
            <tbody>
              {records &&
                records
                  .filter(({ character }) => !!character)
                  .map(({ character, counts }) => {
                    return (
                      <tr title={`Entered ${counts} times`}>
                        <th>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: 5,
                              marginBottom: 5,
                              minWidth: 100,
                            }}
                          >
                            <IconOrChar>{character}</IconOrChar>
                          </div>
                        </th>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: 5,
                              marginBottom: 5,
                              minWidth: 100,
                            }}
                          >
                            {((100 * counts) / totalCharacters).toFixed(2)}%
                          </div>
                        </td>
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
