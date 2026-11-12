import React, { useState } from "react";
import { type ProjectionResult, type UnmappedReason } from "keystats-common/projection";
import { formatCount } from "./KeyboardDiagram.js";

const reasons: Record<UnmappedReason, string> = {
  "source-dead-key": "Ordinary source dead key; composition is not recorded",
  "source-action-unknown": "Unknown source action / firmware control",
  "target-output-unsupported": "No supported route on this target",
  "shortcut-needs-composition": "A text composition recipe is not a shortcut equivalent",
};
export default function ProjectionSummary({ result }: { result: ProjectionResult }) {
  const [unmappedOpen, setUnmappedOpen] = useState(false);
  const unplaced = Object.entries(result.unplacedModifiers);
  const unplacedCount = unplaced.reduce((sum, [, count]) => sum + count, 0);
  return <div className="projection-summary">
    <p>Base-action coverage: {formatCount(result.supportedActionCount)} / {formatCount(result.baseActionCount)}
      {result.baseActionCount > 0 && ` (${(100 * result.supportedActionCount / result.baseActionCount).toFixed(1)}%)`}.
      {" "}This is route coverage, not a guarantee of exact text or complete physical placement.</p>
    <p>Unplaced modifier uses: <strong>{formatCount(unplacedCount)}</strong> — included in the estimated total, but not drawn on a physical key.</p>
    {result.baseActionCount === 0 && <p role="status">No recorded non-modifier actions in this selection.</p>}
    {result.baseActionCount > 0 && result.supportedActionCount === 0 && <p role="status">No supported target routes. Inspect the unmapped actions below.</p>}
    <p>{formatCount(result.sourceModifierCount)} standalone source modifier events are not added again.
      {" "}{formatCount(result.aliasActionCount)} supported actions use confirmed custom glyph aliases;
      {" "}{formatCount(result.recipeActionCount - result.compositionActionCount)} use a literal dead-key + Space recipe;
      {" "}{formatCount(result.compositionActionCount)} use verified French-letter composition.</p>
    {unplaced.length > 0 && <details>
      <summary>Unplaced uses</summary>
      <p>Included in the estimated total, but not placed on a physical key:</p><ul>
        {unplaced.map(([name, count]) => <li key={name}>{name}: {formatCount(count)}</li>)}
      </ul>
    </details>}
    <details onToggle={(event) => setUnmappedOpen(event.currentTarget.open)}>
      <summary>Unmapped source actions: {formatCount(result.unmappedActionCount)}</summary>
      {unmappedOpen && (result.unmapped.length ? <div className="projection-table-scroll"><table>
        <thead><tr><th>Source action</th><th>Recorded count</th><th>Reason</th></tr></thead>
        <tbody>{result.unmapped.map((entry, i) => <tr key={i}>
          <th scope="row"><code>{entry.action}</code><br /><small>0x{entry.source.keycode} · modifiers 0x{entry.source.modifiers.toString(16)} · {entry.source.type}</small></th>
          <td>{formatCount(entry.source.count)}</td><td>{reasons[entry.reason]}</td>
        </tr>)}</tbody>
      </table></div> : <p>No unmapped source actions.</p>)}
    </details>
  </div>;
}
