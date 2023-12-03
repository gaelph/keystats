import React, { useCallback, useMemo } from "react";
import { Tabs, Tab } from "./Tabs.js";
import IconOrChar from "./IconOrChar.js";
import {
  Character,
  // RepetitionsBody,
  // TotalCountBody,
} from "keystats-common/dto/keyboard";
import { useKeyboardData } from "~/state/keyboardData.js";

import * as classes from "./Stats.module.css";

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

export default function StatsComponent(): React.ReactElement {
  const {
    counts: totals,
    characters,
    handAndFingerUsage: repetitions,
  } = useKeyboardData();
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
        return counts.reduce((acc: number, usage) => acc + usage, 0);
      }) || []
    );
  }, [fingerUsage]);

  const handUsage = repetitions?.handRepetitions;
  const handUsageSumPerHand = useMemo(() => {
    return (
      handUsage?.map((counts) => {
        return counts.reduce((acc: number, usage) => acc + usage, 0);
      }) || []
    );
  }, [handUsage]);

  return (
    <div className={classes.statsContainer}>
      <Tabs>
        <Tab title="Keypress Statistics">
          <div>
            <h3>Total key presses: {formatNumber(totalKeypresses)}</h3>
            <p>
              All key presses are counted, including keyboard shortcuts (such as
              Ctrl+Alt+Shift+A, that counts as 4 presses), repetitively typing
              the same key, etc.
            </p>
            <h4>Layer usage</h4>
            <ul role="table">
              {Object.entries(layer).map(([key, value]) => (
                <li key={`keypress-layer-${key}`} role="row">
                  <span role="cell">
                    <strong>Layer #{key}:</strong>{" "}
                  </span>
                  <meter
                    role="cell"
                    min={0}
                    max={100}
                    value={percent(value || 0)}
                  >
                    {percent(value || 0)}
                  </meter>
                  <span role="cell">{percent(value || 0)}%</span>
                </li>
              ))}
            </ul>
            <h4>Row usage</h4>
            <ul role="table">
              {ROW_NAMES.map((name, idx) => (
                <li key={name} role="row">
                  <span role="cell">
                    <strong>{name}:</strong>{" "}
                  </span>
                  <meter
                    role="cell"
                    min={0}
                    max={100}
                    value={percent(row[idx])}
                  >
                    {percent(row[idx])}
                  </meter>
                  <span role="cell">{percent(row[idx])}%</span>
                </li>
              ))}
            </ul>
            <h4>Hand usage</h4>
            <ul role="table">
              <li role="row">
                <span role="cell">
                  <strong>Left:</strong>
                </span>
                <meter role="cell" min={0} max={100} value={percent(hand.left)}>
                  {percent(hand.left)}%
                </meter>
                <span role="cell">{percent(hand.left)}%</span>
              </li>
              <li role="row">
                <span role="cell">
                  <strong>Right:</strong>
                </span>
                <meter
                  role="cell"
                  min={0}
                  max={100}
                  value={percent(hand.right)}
                >
                  {percent(hand.right)}%
                </meter>
                <span role="cell">{percent(hand.right)}%</span>
              </li>
            </ul>
            <h4>Finger usage</h4>
            <ul role="table">
              {FINGER_NAMES.map((name, idx) => (
                <li key={name} role="row">
                  <span role="cell">
                    <strong>{name}:</strong>
                  </span>
                  <meter
                    role="cell"
                    min={0}
                    max={100}
                    value={percent(finger[idx as keyof typeof finger])}
                  >
                    {percent(finger[idx as keyof typeof finger])}
                  </meter>
                  <span role="cell">
                    {percent(finger[idx as keyof typeof finger])}%
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
                      <ul role="table">
                        {f.map(
                          (count, ntimes) =>
                            parseFloat(
                              p(count, fingerUsageSumPerFinger[idx]),
                            ) >= 1 &&
                            ntimes >= 2 && (
                              <li
                                key={`same-finger-use-${idx}-${ntimes}`}
                                role="row"
                              >
                                <span role="cell">
                                  {ntimes == 1 ? (
                                    <strong>Once:</strong>
                                  ) : ntimes == 2 ? (
                                    <strong>Twice:</strong>
                                  ) : (
                                    <strong>{ntimes} times:</strong>
                                  )}
                                </span>
                                <meter
                                  role="cell"
                                  min={0}
                                  max={100}
                                  value={p(count, fingerUsageSumPerFinger[idx])}
                                ></meter>
                                <span role="cell">
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
                  modifiers pressed with the same hand, counts as 3 presses in
                  row for that hand).
                  <br />
                  Counts below 1% are discarded.
                </p>
                <ul>
                  <li>
                    <h5>Left Hand</h5>
                    <ul role="table">
                      {handUsage[0].map(
                        (count, ntimes) =>
                          parseFloat(p(count, handUsageSumPerHand[0])) >= 1 &&
                          ntimes >= 2 && (
                            <li
                              role="row"
                              key={`left_hand_same_use_${ntimes}_${count}`}
                            >
                              <span role="cell">
                                {ntimes == 2 ? (
                                  <strong>Twice:</strong>
                                ) : (
                                  <strong>{ntimes} times:</strong>
                                )}
                              </span>
                              <meter
                                role="cell"
                                min={0}
                                max={100}
                                value={p(count, handUsageSumPerHand[0])}
                              ></meter>
                              <span role="cell">
                                {p(count, handUsageSumPerHand[0])}%
                              </span>
                            </li>
                          ),
                      )}
                    </ul>
                  </li>
                  <li>
                    <h5>Right Hand</h5>
                    <ul role="table">
                      {handUsage[1].map(
                        (count, ntimes) =>
                          parseFloat(p(count, handUsageSumPerHand[1])) >= 1 &&
                          ntimes >= 2 && (
                            <li
                              key={`right_hand_same_use_${ntimes}_${count}`}
                              role="row"
                            >
                              <span role="cell">
                                {ntimes === 2 ? (
                                  <strong>Twice:</strong>
                                ) : (
                                  <strong>{ntimes} times:</strong>
                                )}
                              </span>
                              <meter
                                role="cell"
                                min={0}
                                max={100}
                                value={p(count, handUsageSumPerHand[1])}
                              ></meter>
                              <span role="cell">
                                {p(count, handUsageSumPerHand[1])}%
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
                        <th style={{ width: "5%" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: 5,
                              marginBottom: 5,
                            }}
                          >
                            <IconOrChar>{character}</IconOrChar>
                          </div>
                        </th>
                        <td>
                          <meter min={0} max={totalCharacters} value={counts}>
                            {(100 * counts) / totalCharacters}
                          </meter>
                        </td>
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
    </div>
  );
}
