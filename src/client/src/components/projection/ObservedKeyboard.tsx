import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ObservedProjection, PrintingProjection } from "keystats-common/dto/projection";
import { mergeObservedLayers, observedUsage } from "keystats-common/projection";
import HeatmapComponent from "../Heatmap.js";
import { formatCount } from "./KeyboardDiagram.js";
import UsageStatistics from "./UsageStatistics.js";
import type { ComparisonHeatmapScale } from "~/lib/heatmap.js";

function FittedKeyboard({ observed, normalization }: { observed: ObservedProjection; normalization: ComparisonHeatmapScale }) {
  const { matrix, layer } = useMemo(() => mergeObservedLayers(observed), [observed]);
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const resize = () => setScale(Math.min(1, element.clientWidth / 720));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="projection-observed-diagram" aria-label="First-layer legends with all layers combined by physical position">
    <div className="projection-diagram-scroll">
      <div className="projection-observed-fit" ref={frame} style={{ height: 241 * scale }}>
        <div style={{ width: 720, height: 241, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <HeatmapComponent data={[matrix]} matrix={matrix}
            layerId={0} layer={layer} total={observed.totalKeypresses} showTitle={false} normalization={normalization} />
        </div>
      </div>
    </div>
  </div>;
}

export default function ObservedKeyboard({ observed, name, printing, normalization }: {
  observed?: ObservedProjection; name: string; printing?: PrintingProjection;
  normalization: ComparisonHeatmapScale;
}) {
  const rows = observed ? Math.max(0, ...observed.keymaps.map((layer) => layer.length)) : 0;
  const columns = observed ? Math.max(0, ...observed.keymaps.flatMap((layer) => layer.map((row) => row.length))) : 0;
  const usage = useMemo(() => observed ? observedUsage(observed) : null, [observed]);
  return <section className="projection-observed" aria-label="Actual recorded keyboard">
    <div className="projection-panel-heading">
      <h3>{name} · actual layout</h3>
      <p>{rows === 4 && columns === 12 ? "4 × 12 ortholinear · 48 keys" : rows ? `${rows} × ${columns} recorded matrix` : "Recorded keyboard matrix"}
        {" · first-layer legends, all layers combined"}</p>
      {observed && <p><strong>{formatCount(observed.totalKeypresses)} {printing ? "text-entry uses (estimated modifiers)" : "recorded presses"}</strong></p>}
    </div>
    {!observed || !observed.keymaps.length || !usage ? <div className="projection-unavailable" role="status">The recorded layout is unavailable. Reload the updated service and refresh.</div> : <>
      <FittedKeyboard observed={observed} normalization={normalization} />
      <UsageStatistics usage={usage} observed={!printing} metric={printing ? "text-entry uses" : undefined}
        description={printing
          ? <>{formatCount(printing.sourceEventCount)} recorded printing actions + {formatCount(printing.modifierParticipationCount)} estimated Shift/Option participations.
            Assignments come from your keyboard configuration.</>
          : <>Percentages of all {formatCount(usage.total)} recorded presses across every layer.
            Hand and finger assignments come from your keyboard configuration.</>}
        notes={<>Layers are merged by physical row/column, not keycode. First-layer legends are labels only.
          Physical rows are top, home, bottom and thumb, as on the observed statistics page.
          Missing hand/finger assignments remain unassigned. {printing
            ? "Shift/Option are counted per retained action, not per historical hold. Only uniquely identified modifier positions are drawn; ambiguous positions remain unplaced."
            : "These are recorded presses, not estimated alternative-layout uses."}</>} />
      <div className="projection-inspection">
        {!observed.physicalKeys && <p role="status">Reload the updated service for configured hand/finger assignments.</p>}
        {printing && (observed.unplacedUses || 0) > 0 && <p>{formatCount(observed.unplacedUses!)} estimated Shift/Option uses could not be assigned to a unique physical key.
          They remain in the statistics denominator, but are not drawn on the heatmap.</p>}
      </div>
    </>}
  </section>;
}
