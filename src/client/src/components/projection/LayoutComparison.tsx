import React, { useEffect, useMemo } from "react";
import { targetRegistry, successfulResults, mergeObservedLayers } from "keystats-common/projection";
import { useAppState } from "~/state/appState.js";
import { useProjectionStore } from "~/state/projection.js";
import { datasetKey } from "~/state/projectionStore.js";
import KeyboardDiagram, { formatCount } from "./KeyboardDiagram.js";
import ProjectionSummary from "./ProjectionSummary.js";
import ObservedKeyboard from "./ObservedKeyboard.js";
import ProjectedUsage from "./ProjectedUsage.js";
import { HEATMAP_LEGEND, comparisonHeatmapScale } from "~/lib/heatmap.js";
import "./projection.css";

export default function LayoutComparison() {
  const keyboard = useAppState((state) => state.keyboard);
  const date = useAppState((state) => state.date);
  const request = useProjectionStore((state) => state.request);
  const scale = useProjectionStore((state) => state.scale);
  const setScale = useProjectionStore((state) => state.setScale);
  const activity = useProjectionStore((state) => state.activity);
  const setActivity = useProjectionStore((state) => state.setActivity);
  const targetId = useProjectionStore((state) => state.targetId);
  const setTarget = useProjectionStore((state) => state.setTarget);
  const load = useProjectionStore((state) => state.load);
  const day = date?.format("YYYY-MM-DD") || null;
  const id = keyboard?.id;
  useEffect(() => { if (id) void load({ keyboardId: id, date: day }); }, [id, day, load]);
  const key = id ? datasetKey({ keyboardId: id, date: day }) : null;
  const ready = request.status === "ready" && request.key === key ? request : null;
  const selection = activity === "printing" ? ready?.source.printing : ready?.source;
  const results = activity === "printing" ? ready?.printingResults : ready?.results;
  const target = targetRegistry.find((entry) => entry.id === targetId);
  const outcome = targetId ? results?.[targetId] : undefined;
  const availableResults = useMemo(() => successfulResults(results || {}), [results]);
  const normalization = useMemo(() => comparisonHeatmapScale([
    selection?.observed ? mergeObservedLayers(selection.observed).matrix.flat() : [],
    ...availableResults.map((result) => Object.values(result.keyUses)),
  ], selection?.sourceEventCount || 0, scale), [selection, availableResults, scale]);
  const { maximum } = normalization;
  if (!id) return <p role="status">Select a recording keyboard to compare layouts.</p>;
  const dataset = { keyboardId: id, date: day };
  return <section className="layout-comparison" aria-labelledby="projection-heading">
    <h2 id="projection-heading">Layout comparison</h2>
    <p>Source: <strong>{keyboard.name}</strong> · {day || "All Time"} · assumed input layout: <strong>macOS French</strong>.</p>
    <p className="projection-notice"><strong>{activity === "printing"
      ? "Printing only: text-entry actions plus Shift/Option participation. The 4×12 modifier counts are estimates, not reconstructed holds."
      : "Projected layouts show estimated key uses; the actual layout shows recorded presses."}</strong>{" "}
      Modifiers count per participating action; verified dead-key recipes add completing key actions.
      Source composition and historical keymap changes cannot be reconstructed. See assumptions below.</p>
    <div className="projection-controls projection-activity-controls" role="group" aria-label="Activity included in comparison">
      <span>Include:</span>
      <button type="button" className={activity === "all" ? "active" : undefined} aria-pressed={activity === "all"} onClick={() => setActivity("all")}>All presses</button>
      <button type="button" className={activity === "printing" ? "active" : undefined} aria-pressed={activity === "printing"} onClick={() => setActivity("printing")}>Printing only</button>
    </div>
    <div className="projection-target-control">
      <label htmlFor="comparison-target">Compare with</label>
      <select id="comparison-target" value={targetId || ""} onChange={(event) => setTarget(event.target.value)} aria-describedby="comparison-target-availability">
        {!targetId && <option value="" disabled>No available target</option>}
        {targetRegistry.map((entry) => <option key={entry.id} value={entry.id}
          disabled={entry.status !== "available" || (results && results[entry.id]?.status !== "ready")}>{entry.label}</option>)}
      </select>
    </div>
    <div id="comparison-target-availability" className="projection-availability">
      {targetRegistry.map((entry) => {
        const result = results?.[entry.id];
        const reason = entry.status === "unavailable" ? entry.reason : result && result.status !== "ready" ? result.reason : null;
        return reason ? <p key={entry.id}><strong>{entry.label} unavailable:</strong> {reason}</p> : null;
      })}
    </div>
    <div className="projection-controls" role="group" aria-label="Shared heatmap scale across available catalogue layouts">
      <span>Heatmap scale:</span>
      <button type="button" className={scale === "linear" ? "active" : undefined} aria-pressed={scale === "linear"} onClick={() => setScale("linear")}>Linear</button>
      <button type="button" className={scale === "log" ? "active" : undefined} aria-pressed={scale === "log"} onClick={() => setScale("log")}>Logarithmic</button>
    </div>
    {request.status === "error" && request.key === key ? <div role="alert">
      <p>{request.message}</p><button onClick={() => void load(dataset, true)}>Retry projection</button>
    </div> : !ready ? <p role="status" aria-live="polite">Loading projection…</p> : !selection || !results ?
      <p role="alert">Printing-only data is unavailable. Reload the updated service, then use Refresh.</p> : <>
      {activity === "printing" && ready.source.printing && <p className="projection-filter-summary">
        {formatCount(ready.source.printing.sourceEventCount)} printing actions retained; {formatCount(ready.source.printing.excludedEventCount)} other recorded events excluded.
        {" "}Space is included. Navigation, editing, Enter/Tab, Cmd/Ctrl shortcuts, standalone modifiers, unknown actions and unresolved source dead keys are excluded.
        {" "}Shift/Option participation is added per retained action; applications may still interpret some combinations as shortcuts.
        {ready.source.printing.sourceEventCount === 0 && <strong> No identifiable printing actions in this selection.</strong>}
      </p>}
      <div className="projection-legend" aria-label={`Shared ${scale} intensity scale across available catalogue layouts, 0 to ${maximum} presses or uses`}>
        <span>0</span><span className="projection-gradient" style={{ background: HEATMAP_LEGEND }} />
        <span>{formatCount(maximum)} presses / uses</span><small>{scale === "log" ? "Logarithmic intensity" : "Linear intensity"}; catalogue-wide range includes all available layouts, even hidden ones. Selecting a target keeps source colors stable. Equal counts have equal intensity before hotspots blend; recorded presses and estimated uses remain different metrics.</small>
      </div>
      <p className="projection-loaded">Loaded {new Date(ready.loadedAt).toLocaleTimeString()} · use Refresh for new records.</p>
      <div className="projection-panels">
        <ObservedKeyboard observed={selection.observed} name={keyboard.name} printing={activity === "printing" ? ready.source.printing : undefined} normalization={normalization} />
        {target?.status === "available" && outcome?.status === "ready" ? <section key={target.id} aria-label={`${target.label} projection`}>
        <div className="projection-panel-heading">
        <h3>{target.label}</h3><p>{target.reference}</p>
        <p><strong>{formatCount(outcome.result.estimatedUseCount)} estimated key uses</strong></p>
        </div>
        <KeyboardDiagram key={`${key}/${activity}/${target.id}`} profile={target.profile} result={outcome.result} normalization={normalization}
          statistics={<ProjectedUsage profile={target.profile} result={outcome.result} />}>
        <ProjectionSummary key={`summary/${key}/${activity}/${target.id}`} result={outcome.result} />
        <details className="projection-profile-notes"><summary>Selected layout definition</summary>
          <p>{target.notes}</p><p>{target.provenance}</p>
          <p>Profile: <code>{target.profile.id}</code> · <a href={target.sourceUrl}>Reference source</a></p>
        </details>
        </KeyboardDiagram>
      </section> : <section aria-label="Unavailable target">
        <div className="projection-panel-heading"><h3>{target?.label || "No available target"}</h3></div>
        <div className="projection-unavailable" role="alert">
          {outcome && outcome.status !== "ready" ? outcome.reason : target?.status === "unavailable" ? target.reason : "No target is available. The observed keyboard remains usable."}
          <p>{availableResults.length ? "Select another available layout. A failed target is never replaced silently after refresh."
            : "No target is available for this selection. The observed keyboard remains usable; use Refresh or select another date."}</p>
        </div>
      </section>}</div>
      <details><summary>Assumptions and reference profiles</summary>
        <p>Caps Lock off; source input layout and relevant firmware character mappings declared stable; no relevant host remapping.
          Shift/Option use the opposite target hand. Space uses the left thumb. Missing side-specific modifiers are shown by family, not moved silently.</p>
        <p>Fn participates in function/control routes. Multi-step text recipes are never substituted for shortcuts.
          Source text-producing Shift/Option are replaced by target requirements; Command/Control are retained, without inferring application behavior.
          Unknown macros, layer controls, missing outputs and ordinary source dead keys remain visible as unmapped actions.</p>
        <p>Targets use pinned definitions and per-profile provenance. ISRT has verified base/Shift outputs only; missing Option levels remain unsupported.
          Colemak-DH ISO uses its documented Angle fingering. System-action positions are a simplified convention, not your OS preferences.</p>
        <p>French-letter composition is limited to one dead key plus one completing key, with exact output codepoints and no Unicode normalization.
          Choose the route with the fewest counted uses; unsupported recipes remain unmapped. Composition is never used for Cmd/Ctrl shortcuts.</p>
      </details>
    </>}
  </section>;
}
