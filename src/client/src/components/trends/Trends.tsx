import React, { useEffect, useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendsResponse, TrendBucket } from "keystats-common/dto/trends";
import { getTrends } from "~/lib/api.js";
import { useAppState } from "~/state/appState.js";
import { useTrendsRefresh } from "~/state/trendsRefresh.js";

const categories = {
  rows: ["function", "number", "top", "home", "bottom", "thumb", "navigation", "unplaced"],
  hands: ["left", "right", "unplaced"],
  fingers: ["left-pinkie", "left-ring", "left-middle", "left-index", "left-thumb", "right-thumb", "right-index", "right-middle", "right-ring", "right-pinkie", "unassigned"],
} as const;
type Dimension = keyof typeof categories;
type Preferences = {
  range: "7" | "30" | "90" | "year" | "all" | "custom"; start: string; end: string;
  grouping: "auto" | "daily" | "weekly" | "monthly"; activity: "all" | "printing";
  characters: string[] | null; characterMeasure: "count" | "share";
  dimension: Dimension; physicalMeasure: "count" | "share"; selected: Record<Dimension, string[]>;
};
const defaults: Preferences = { range: "30", start: "", end: "", grouping: "auto", activity: "all", characters: null,
  characterMeasure: "share", dimension: "rows", physicalMeasure: "share",
  selected: { rows: [...categories.rows], hands: [...categories.hands], fingers: [...categories.fingers] } };
const colors = ["#5e35b1", "#007f82", "#c05438", "#a14d93", "#416ab0", "#927000", "#588547", "#a75355", "#49768b", "#8b6741", "#686868"];
const storageKey = "keystats:trends";
const inFlight = new Map<string, Promise<TrendsResponse>>();
const cache = new Map<string, TrendsResponse>();
function preferences(): Preferences {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return { ...defaults, ...saved, selected: { ...defaults.selected, ...saved.selected } };
  } catch { return defaults; }
}
function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function rangeFor(prefs: Preferences): { start: string | null; end: string } {
  const now = new Date();
  const end = prefs.range === "custom" ? prefs.end : localDate(now);
  if (prefs.range === "all") return { start: null, end };
  if (prefs.range === "custom") return { start: prefs.start, end };
  if (prefs.range === "year") { now.setFullYear(now.getFullYear() - 1); now.setDate(now.getDate() + 1); }
  else now.setDate(now.getDate() - Number(prefs.range) + 1);
  return { start: localDate(now), end };
}
const keyPrefix = "\u0000key:";
const characterLabel = (character: string) => character.startsWith(keyPrefix) ? character.slice(keyPrefix.length) : character === " " ? "Space" : character;
const nice = (name: string) => name.replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
const bucketLabel = (bucket: TrendBucket) => `${bucket.start}${bucket.end !== bucket.start ? ` – ${bucket.end}` : ""}${bucket.partial ? " (partial)" : ""}`;

type Series = { key: string; name: string; color: string };
type Point = { date: string; bucket: TrendBucket; [key: string]: string | number | null | TrendBucket };
function Chart({ title, data, series, share, stacked }: { title: string; data: Point[]; series: Series[]; share?: boolean; stacked?: boolean }) {
  return <section aria-label={title} className="trends-chart">
    <h3>{title}</h3>
    <div className="trends-chart-area">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} syncId="trends" accessibilityLayer margin={{ top: 8, right: 20, left: 10, bottom: 4 }}>
          <CartesianGrid stroke="#e2e3e5" strokeDasharray="3 3" />
          <XAxis dataKey="date" minTickGap={35} tick={{ fontSize: 12 }} />
          <YAxis domain={[0, "auto"]} width={62} tick={{ fontSize: 12 }} tickFormatter={(v: number) => share ? `${v}%` : Intl.NumberFormat(undefined, { notation: "compact" }).format(v)} />
          <Tooltip content={({ active, payload }) => {
            const point = payload?.[0]?.payload as Point | undefined;
            if (!active || !point) return null;
            return <div className="trends-tooltip"><strong>{bucketLabel(point.bucket)}</strong>
              <div>{point.bucket.recordedDays} / {point.bucket.calendarDays} days with records</div>
              {series.map((item) => <div key={item.key}><span style={{ color: item.color }}>●</span> {item.name}: {point[item.key] == null ? "No data" : `${Number(point[item.key]).toLocaleString(undefined, { maximumFractionDigits: 2 })}${share ? "%" : ""}`}</div>)}
            </div>;
          }} />
          {series.map((item) => stacked
            ? <Area key={item.key} type="linear" dataKey={item.key} name={item.name} stackId="finger-usage" stroke={item.color} fill={item.color} fillOpacity={0.85} strokeWidth={1} connectNulls={false} isAnimationActive={false} />
            : <Line key={item.key} type="linear" dataKey={item.key} name={item.name} stroke={item.color} strokeWidth={2} dot={data.length <= 31} connectNulls={false} isAnimationActive={false} />)}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </section>;
}

export default function Trends() {
  const keyboard = useAppState((state) => state.keyboard);
  const refresh = useTrendsRefresh((state) => state.version);
  const [prefs, setPrefs] = useState(preferences);
  const [search, setSearch] = useState("");
  const [retry, setRetry] = useState(0);
  const [inspection, setInspection] = useState(0);
  const [snapshot, setSnapshot] = useState<{ key: string; data: TrendsResponse } | null>(null);
  const [status, setStatus] = useState<{ key: string; loading: boolean; error?: string }>({ key: "", loading: false });
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(prefs)); } catch { /* storage is optional */ } }, [prefs]);
  // Re-evaluate relative ranges only when their intent, keyboard or refresh changes.
  const range = useMemo(() => rangeFor(prefs), [prefs.range, prefs.start, prefs.end, keyboard?.id, refresh, retry]);
  const valid = !!range.end && (range.start === null || (!!range.start && range.start <= range.end));
  const key = JSON.stringify([keyboard?.id, range.start, range.end, prefs.grouping]);
  useEffect(() => {
    if (!keyboard || !valid) return;
    let active = true;
    setStatus({ key, loading: true });
    const requestKey = `${key}/${refresh}/${retry}`;
    let request = cache.has(requestKey) ? Promise.resolve(cache.get(requestKey)!) : inFlight.get(requestKey);
    if (!request) {
      request = getTrends(keyboard.id, range.start, range.end, prefs.grouping).then((result) => {
        cache.set(requestKey, result);
        if (cache.size > 4) cache.delete(cache.keys().next().value!);
        return result;
      });
      inFlight.set(requestKey, request);
      request.finally(() => { if (inFlight.get(requestKey) === request) inFlight.delete(requestKey); }).catch(() => {});
    }
    request.then((data) => {
      if (!active) return;
      if (data.keyboardId !== keyboard.id || data.end !== range.end || (range.start && data.start !== range.start)) throw new Error("Trends response does not match the selection");
      setSnapshot({ key, data }); setStatus({ key, loading: false });
      setPrefs((current) => {
        if (current.characters !== null) return current;
        const totals: Record<string, number> = Object.create(null);
        for (const bucket of data.buckets) for (const [char, count] of Object.entries(bucket.characters)) if (char !== " ") totals[char] = (totals[char] || 0) + count;
        const top = Object.keys(totals).sort((a, b) => totals[b] - totals[a] || a.localeCompare(b)).slice(0, 3);
        if (!top.length && data.buckets.some((bucket) => (bucket.characters[" "] || 0) > 0)) top.push(" ");
        return top.length ? { ...current, characters: top } : current;
      });
    }).catch((error: unknown) => { if (active) setStatus({ key, loading: false, error: error instanceof Error ? error.message : "Could not load trends" }); });
    return () => { active = false; };
  }, [key, refresh, retry]);
  const data = snapshot?.key === key ? snapshot.data : null;
  const selectedCharacters = prefs.characters || [];
  const selectedPhysical = prefs.selected[prefs.dimension] || [];
  const update = (changes: Partial<Preferences>) => setPrefs((current) => ({ ...current, ...changes }));
  const togglePhysical = (value: string) => setPrefs((current) => {
    const existing = current.selected[current.dimension];
    return { ...current, selected: { ...current.selected, [current.dimension]: existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value] } };
  });
  const toggleCharacter = (value: string) => {
    const next = selectedCharacters.includes(value) ? selectedCharacters.filter((v) => v !== value) : [...selectedCharacters, value];
    if (next.length >= 1 && next.length <= 6) update({ characters: next });
  };
  const characterSeries = selectedCharacters.map((name, i) => ({ key: `c${i}`, name: characterLabel(name), color: colors[i % colors.length] }));
  const physicalSeries = selectedPhysical.map((name, i) => ({ key: `p${i}`, name: nice(name), color: colors[categories[prefs.dimension].indexOf(name as never) % colors.length] || colors[i % colors.length] }));
  const volumeSeries = [{ key: "volume", name: prefs.activity === "all" ? "Recorded presses" : "Printing actions", color: colors[0] }];
  const points: Point[] = (data?.buckets || []).map((bucket) => {
    const present = bucket.recordedDays > 0;
    const usage = prefs.activity === "all" ? bucket.allUsage : bucket.printingUsage;
    const point: Point = { date: bucket.start, bucket, volume: present ? prefs.activity === "all" ? bucket.recorded : bucket.printing : null };
    selectedCharacters.forEach((char, i) => { const count = char.startsWith(keyPrefix) ? bucket.controls[char.slice(keyPrefix.length)] || 0 : bucket.characters[char] || 0;
      const total = bucket.characterTotal + bucket.controlTotal;
      point[`c${i}`] = !present || (prefs.characterMeasure === "share" && !total) ? null : prefs.characterMeasure === "share" ? count * 100 / total : count; });
    selectedPhysical.forEach((category, i) => { const count = usage ? (usage[prefs.dimension] as Record<string, number>)[category] || 0 : 0;
      point[`p${i}`] = !usage || (prefs.physicalMeasure === "share" && !usage.total) ? null : prefs.physicalMeasure === "share" ? count * 100 / usage.total : count; });
    return point;
  });
  const inspected = points[Math.min(inspection, points.length - 1)];
  return <section className="trends" aria-labelledby="trends-heading">
    <h2 id="trends-heading">Trends</h2>
    <p>Recorded activity for {keyboard?.name || "the selected keyboard"}. Historical interpretation assumes the current keymap and finger assignments, and macOS French input. Character actions include shortcuts and do not necessarily represent text entered into an app.</p>
    <div className="trends-controls">
      <label>Range<select value={prefs.range} onChange={(event) => update({ range: event.target.value as Preferences["range"] })}>
        <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="year">Last year</option><option value="all">All history</option><option value="custom">Custom</option>
      </select></label>
      {prefs.range === "custom" && <><label>Start<input type="date" value={prefs.start} onChange={(event) => update({ start: event.target.value })} /></label><label>End<input type="date" value={prefs.end} onChange={(event) => update({ end: event.target.value })} /></label></>}
      <label>Grouping<select value={prefs.grouping} onChange={(event) => update({ grouping: event.target.value as Preferences["grouping"] })}><option value="auto">Automatic</option><option value="daily">Daily</option><option value="weekly">Weekly (Monday start)</option><option value="monthly">Monthly</option></select></label>
      <label>Activity<select value={prefs.activity} onChange={(event) => update({ activity: event.target.value as Preferences["activity"] })}><option value="all">Recorded presses</option><option value="printing">Printing actions</option></select></label>
    </div>
    <p>Days without records are gaps, not confirmed zeroes. Bucket totals cover only recorded days; coverage does not prove continuous collection. Printing volume excludes modifiers; printing physical workload includes estimated Shift/Option participation.</p>
    {!keyboard ? <p role="status">Select a keyboard.</p> : !valid ? <p role="alert">Choose a valid start and end date.</p> : <>
      {status.key === key && status.loading && <p role="status">Loading trends…</p>}
      {status.key === key && status.error && <p role="alert">{status.error} {data && <strong>Showing the previous snapshot.</strong>} <button onClick={() => setRetry((value) => value + 1)}>Retry</button></p>}
      {data && <>
        <p>Snapshot: {new Date(data.generatedAt).toLocaleString()} · {data.grouping} · {data.start} to {data.end}. Use Refresh to update.</p>
        {!data.buckets.some((bucket) => bucket.recordedDays) && <p role="status">No records in this range.</p>}
        <Chart title="Volume" data={points} series={volumeSeries} />
        <div className="trends-controls">
          <label>Action display<select value={prefs.characterMeasure} onChange={(event) => update({ characterMeasure: event.target.value as Preferences["characterMeasure"] })}><option value="share">Share of decoded actions</option><option value="count">Count</option></select></label>
          <details className="trends-picker" onKeyDown={(event) => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}>
            <summary>Choose characters and keys ({selectedCharacters.length}/6)</summary>
            <div className="trends-picker-panel">
              <label>Search characters and keys<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search, e.g. Backspace" /></label>
              <p>Choose up to six; at least one must remain selected.</p>
              <div className="trends-picker-list">
                {([ ["Keys", [...new Set([...data.controls.map((name) => keyPrefix + name), ...selectedCharacters.filter((name) => name.startsWith(keyPrefix))])]],
                  ["Characters", [...new Set([...data.characters, ...selectedCharacters.filter((name) => !name.startsWith(keyPrefix))])]] ] as [string, string[]][]).map(([heading, values]) => {
                  const matching = values.sort((a, b) => characterLabel(a).localeCompare(characterLabel(b))).filter((value) => characterLabel(value).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
                  return matching.length ? <fieldset key={heading}><legend>{heading}</legend><div className="trends-picker-grid">{matching.map((value) => <label key={value}><input type="checkbox" checked={selectedCharacters.includes(value)} disabled={selectedCharacters.includes(value) ? selectedCharacters.length === 1 : selectedCharacters.length >= 6} onChange={() => toggleCharacter(value)} /> <span>{characterLabel(value)}</span></label>)}</div></fieldset> : null;
                })}
                {!data.characters.length && !data.controls.length && !selectedCharacters.length && <p>No decoded actions in this keyboard's history.</p>}
              </div>
            </div>
          </details>
        </div>
        <div className="trends-selected-actions" aria-label="Selected actions">{characterSeries.map((item) => <span key={item.key}><span aria-hidden="true" style={{ color: item.color }}>●</span> {item.name}</span>)}</div>
        <p>Shares use all decoded character and named key actions, including Space and shortcuts, as the denominator. Key counts combine modifier combinations. This chart is independent of the activity filter.</p>
        {data.buckets.some((bucket) => bucket.recordedDays) && !data.buckets.some((bucket) => bucket.characterTotal + bucket.controlTotal) && <p>No decoded character or key actions in this range.</p>}
        <Chart title="Character and key actions" data={points} series={characterSeries} share={prefs.characterMeasure === "share"} />
        <div className="trends-controls">
          <label>Physical dimension<select value={prefs.dimension} onChange={(event) => update({ dimension: event.target.value as Dimension })}><option value="rows">Row</option><option value="hands">Hand</option><option value="fingers">Finger</option></select></label>
          <label>Physical display<select value={prefs.physicalMeasure} onChange={(event) => update({ physicalMeasure: event.target.value as Preferences["physicalMeasure"] })}><option value="share">Share of included uses</option><option value="count">Count</option></select></label>
        </div>
        <fieldset className="trends-options"><legend>Physical categories</legend>{categories[prefs.dimension].map((name, index) => <label key={name}><input type="checkbox" checked={selectedPhysical.includes(name)} onChange={() => togglePhysical(name)} /> {selectedPhysical.includes(name) && <span aria-hidden="true" style={{ color: colors[index % colors.length] }}>● </span>}{nice(name)}</label>)}</fieldset>
        <p>Shares include all uses, including unplaced or unassigned uses, whether or not their series is selected. A zero denominator has no percentage.</p>
        <Chart title="Physical workload" data={points} series={physicalSeries} share={prefs.physicalMeasure === "share"} stacked={prefs.dimension === "fingers"} />
        {inspected && <div className="trends-inspect"><label htmlFor="trend-inspect">Inspect a bucket across all charts</label>
          <input id="trend-inspect" type="range" min="0" max={points.length - 1} value={Math.min(inspection, points.length - 1)} onChange={(event) => setInspection(Number(event.target.value))} aria-valuetext={bucketLabel(inspected.bucket)} />
          <div aria-live="polite"><strong>{bucketLabel(inspected.bucket)}</strong>: {inspected.bucket.recordedDays} / {inspected.bucket.calendarDays} days with records.
            {[...volumeSeries, ...characterSeries, ...physicalSeries].map((series) => <span key={series.key}> {series.name}: {inspected[series.key] == null ? "no data" : Number(inspected[series.key]).toLocaleString(undefined, { maximumFractionDigits: 2 })}{inspected[series.key] != null && ((series.key.startsWith("c") && prefs.characterMeasure === "share") || (series.key.startsWith("p") && prefs.physicalMeasure === "share")) ? "%" : ""};</span>)}
          </div>
        </div>}
      </>}
    </>}
  </section>;
}
