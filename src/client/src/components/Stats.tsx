import React, { useCallback, useMemo } from "react";
import { Tabs, Tab } from "./Tabs.js";
import IconOrChar from "./IconOrChar.js";
import {
  Character,
  RepetitionsBody,
  TotalCountBody,
} from "keystats-common/dto/keyboard";

const numberFormater = new Intl.NumberFormat("en-US", {});
function formatNumber(n: number): string {
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

const p = (v: number, total: number): string => ((100 * v) / total).toFixed(2);

interface StatsComponentProps {
  totals: TotalCountBody;
  repetitions: RepetitionsBody | null;
  characters: { records: Character[]; totalCharacters: number } | null;
}

export default function StatsComponent({
  totals,
  repetitions,
  characters,
}: StatsComponentProps): React.ReactElement<StatsComponentProps> {
  const { totalKeypresses } = totals;
  let records: Character[] = [];
  let totalCharacters = 0;
  if (characters) {
    records = characters.records;
    totalCharacters = characters.totalCharacters;
  }

  const percent = useCallback(
    (v: number): string => {
      if (!totalKeypresses) return (0).toFixed(2);
      return ((100 * v) / totalKeypresses).toFixed(2);
    },
    [totalKeypresses],
  );

  const hand = { left: totals.handUsage[0], right: totals.handUsage[1] };
  const finger = totals.fingerUsage;
  const row = totals.rowUsage;
  const layer = totals.layerUsage;

  const fingerUsage = repetitions?.fingerRepetitions;
  const fingerUsageSumPerFinger = useMemo(() => {
    return (
      fingerUsage?.map((counts) => {
        return counts.reduce((acc: number, usage) => acc + (usage || 0), 0);
      }) || []
    );
  }, [fingerUsage]);

  const handUsage = repetitions?.handRepetitions;
  const handUsageSumPerHand = useMemo(() => {
    return (
      handUsage?.map((counts) => {
        return counts.reduce((acc: number, usage) => acc + (usage || 0), 0);
      }) || []
    );
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
                <span>{percent(value || 0)}%</span>
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
                <span>{percent(row[idx as keyof typeof row] || 0)}%</span>
              </li>
            ))}
          </ul>
          <h4>Hand usage</h4>
          <ul>
            <li>
              <span>
                <strong>Left:</strong> {percent(hand.left || 0)}%
              </span>
            </li>
            <li>
              <span>
                <strong>Right:</strong> {percent(hand.right || 0)}%
              </span>
            </li>
          </ul>
          <h4>Finger usage</h4>
          <ul>
            {FINGER_NAMES.map((name, idx) => (
              <li key={name}>
                <span>
                  <strong>{name}:</strong>{" "}
                  {percent(finger[idx as keyof typeof finger] || 0)}%
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
                                {p(count || 0, fingerUsageSumPerFinger[idx])}%
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
                    {handUsage[1].map(
                      (count, ntimes) =>
                        parseFloat(p(count || 0, handUsageSumPerHand[1])) >=
                          1 &&
                        ntimes >= 2 && (
                          <li key={`right_hand_same_use_${ntimes}_${count}`}>
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
                records.map(({ character, counts }, idx) => {
                  return (
                    <tr
                      title={`Entered ${counts} times`}
                      key={`tr-${character}-${counts}-${idx}`}
                    >
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
