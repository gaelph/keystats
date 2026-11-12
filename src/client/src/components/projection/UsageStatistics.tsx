import React from "react";
import type { KeyboardUsage } from "keystats-common/projection";
import * as classes from "../Stats.module.css";
import { formatCount } from "./KeyboardDiagram.js";

const rowNames = { function: "Function row / Escape", number: "Number row", top: "Top row",
  home: "Home row", bottom: "Bottom row", thumb: "Thumb / modifier row", navigation: "Arrow keys", unplaced: "Other / unplaced" };
const handNames = { left: "Left", right: "Right", unplaced: "Unassigned / unplaced" };
const fingerNames = { "left-pinkie": "Left pinkie", "left-ring": "Left ring", "left-middle": "Left middle",
  "left-index": "Left index", "left-thumb": "Left thumb", "right-thumb": "Right thumb", "right-index": "Right index",
  "right-middle": "Right middle", "right-ring": "Right ring", "right-pinkie": "Right pinkie", unassigned: "Unassigned" };

function Distribution({ title, counts, labels, total, metric, kind }: {
  title: string; counts: Record<string, number>; labels: Record<string, string>; total: number;
  metric: string; kind: string;
}) {
  return <div className="projection-distribution" data-usage={kind}>
    <h4>{title}</h4>
    <ul role="table" aria-label={title}>
      {Object.entries(counts).map(([key, count]) => <li role="row" key={key}>
        <span role="cell"><strong>{labels[key]}:</strong></span>
        <span role="cell"><meter min={0} max={total || 1} value={count} title={`${formatCount(count)} ${metric}`}
          aria-label={`${labels[key]} ${metric}`}>{count} / {total}</meter></span>
        <span role="cell">{(total ? 100 * count / total : 0).toFixed(2)}%</span>
      </li>)}
    </ul>
  </div>;
}

export default function UsageStatistics({ usage, observed = false, description, notes, metric: customMetric }: {
  usage: KeyboardUsage; observed?: boolean; description: React.ReactNode; notes: React.ReactNode; metric?: string;
}) {
  const metric = customMetric || (observed ? "recorded presses" : "estimated uses");
  return <div className={`${classes.statsContainer} projection-usage`}>
    <div className="projection-usage-intro">
      <h3>{observed ? "Recorded" : "Estimated"} usage statistics</h3>
      <p>{description}</p>
    </div>
    <Distribution kind="rows" title="Row usage" counts={usage.rows} labels={rowNames} total={usage.total} metric={metric} />
    <Distribution kind="hands" title="Hand usage" counts={usage.hands} labels={handNames} total={usage.total} metric={metric} />
    <Distribution kind="fingers" title="Finger usage" counts={usage.fingers} labels={fingerNames} total={usage.total} metric={metric} />
    <div className="projection-usage-notes"><p><small>{notes}</small></p></div>
  </div>;
}
