import React, { useEffect, useState } from "react";
import * as Heatmap from "heatmap.js";
import { type LayoutProfile, type ProjectionResult } from "keystats-common/projection";
import { HEATMAP_GRADIENT, KEY_WIDTH, comparisonHeatmapData, type ComparisonHeatmapScale } from "~/lib/heatmap.js";

export const formatCount = (count: number) => new Intl.NumberFormat("en-US").format(count);

export default function KeyboardDiagram({ profile, result, normalization, statistics, children }: {
  profile: LayoutProfile; result: ProjectionResult; normalization: ComparisonHeatmapScale;
  statistics: React.ReactNode; children?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tableOpen, setTableOpen] = useState(false);
  const [image, setImage] = useState("");
  useEffect(() => {
    const container = document.createElement("div");
    const heatmap = Heatmap.create({ container, width: 900, height: 375,
      radius: KEY_WIDTH, gradient: HEATMAP_GRADIENT });
    heatmap.setData(comparisonHeatmapData(profile.keys.map((entry) => ({
      x: Math.round((entry.x + entry.width / 2) * KEY_WIDTH),
      y: Math.round((entry.y + entry.height / 2) * KEY_WIDTH),
      value: result.keyUses[entry.id] || 0,
    })), normalization));
    setImage(heatmap.getDataURL());
    return () => { container.replaceChildren(); };
  }, [profile, result, normalization]);
  const key = profile.keys.find((entry) => entry.id === selected);
  const shape = (entry: LayoutProfile["keys"][number]) => entry.isoEnter
    ? <polygon points={`0,0 ${entry.width - .06},0 ${entry.width - .06},${entry.height - .06} .25,${entry.height - .06} .25,.99 0,.99`} />
    : <rect width={entry.width - .06} height={entry.height - .06} />;
  return <>
    <div className="projection-diagram-scroll"><svg className="projection-keyboard" viewBox="-0.08 -0.08 15.16 6.45" role="group"
      aria-label={`${profile.name}: estimated key uses. Focus or select a key for details.`}>
      {image && <image className="projection-heatmap-image" href={image} x="0" y="0" width="15" height="6.25"
        aria-hidden="true" />}
      {profile.keys.map((entry) => {
        const count = result.keyUses[entry.id] || 0;
        const label = `${entry.modifier?.side || ""} ${entry.label}`.trim();
        return <g key={entry.id} transform={`translate(${entry.x} ${entry.y})`}
          className="projection-key" tabIndex={0} role="button" aria-pressed={selected === entry.id}
          aria-label={`${label}: ${formatCount(count)} estimated uses`}
          onFocus={() => setSelected(entry.id)} onClick={() => setSelected(entry.id)}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(entry.id); } }}
          >
          <title>{label}: {formatCount(count)} estimated uses</title>
          {shape(entry)}
          <text x={(entry.width - .06) / 2} y={Math.min(entry.height - .06, 1) / 2 + .065}
            style={{ fontSize: entry.y === 0 ? ".18px" : ".2667px" }}>
            {entry.label}
          </text>
        </g>;
      })}
    </svg></div>
    {statistics}
    <div className="projection-inspection">
    <div className="projection-key-detail" aria-live="polite" aria-atomic="true">
      {key ? <>
        <strong>{key.modifier?.side} {key.label}: {formatCount(result.keyUses[key.id])} estimated uses</strong>
        <details key={`${profile.id}/${key.id}`}>
          <summary>Contributing actions and target steps</summary>
          {result.contributions[key.id].length ? <ul>
            {result.contributions[key.id].map((entry, i) => <li key={i}>
              <code>{entry.action}</code> → {entry.route}: <strong>{formatCount(entry.count)}</strong>
            </li>)}
          </ul> : <p>No projected use of this key in the selected data.</p>}
        </details>
      </> : <p>Focus or tap any key to inspect its workload.</p>}
    </div>
    <details onToggle={(event) => setTableOpen(event.currentTarget.open)}>
      <summary>Keyboard data table (non-color alternative)</summary>
      {tableOpen && <div className="projection-table-scroll"><table>
        <caption>{profile.name} · estimated key uses</caption>
        <thead><tr><th>Key / position</th><th>Estimated uses</th></tr></thead>
        <tbody>{profile.keys.map((entry) => <tr key={entry.id}>
          <th scope="row">{entry.modifier?.side} {entry.label} <small>({entry.id})</small></th>
          <td>{formatCount(result.keyUses[entry.id])}</td>
        </tr>)}</tbody>
      </table></div>}
    </details>
    {children}
    </div>
  </>;
}
