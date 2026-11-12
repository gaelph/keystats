# Layout comparison — implementation notes

## Selectable layout expansion

Implemented the approved [selector plan](layout-selector-expansion-plan.md):

- Exactly two panels and an accessible native selector. AZERTY is the default;
  a guarded browser-wide preference remembers only the target, not other controls.
- `projection/catalogue.ts` declares the five stable target IDs, per-profile
  provenance/availability, isolated keyed computation outcomes and startup fallback.
  All five approved profiles are enabled after corroborating base/Shift data.
- Existing source French decoding is separate from optional native target recipes.
  A target construction/computation failure cannot silently substitute another
  mapping or relabel a previous result.
- Colemak-DH ISO Extended/Bépo 1.1rc2 output tables are imported offline from pinned
  artifacts; original ISRT base/Shift data is corroborated against independent
  references. ISRT Option remains unsupported. Data licensing/attribution and
  regeneration commands are in `projection/profiles/README.md` and `sources.json`.
- `participation.ts` resolves step participants once consistently for both route
  ranking and accounting. Minimum-use selection includes unplaced participation;
  ties use fewer steps, fewer modifiers, declared priority and stable step ordering.
- Approved target recipes cover the French set/uppercase with one dead-key step
  plus completion. Native recipes are probed without switching inputs; XML
  definitions are interpreted offline with exact output matching. No canonical
  Unicode folding, arbitrary composition, composed shortcuts or source inference.
- The existing bounded snapshot cache holds ID-keyed outcomes for each activity.
  Target selection is local; scale uses source plus all valid available targets,
  even hidden ones, so source counts/pixels remain stable while selecting.
- `targetPreference.ts` isolates storage access. Invalid/disabled startup choices
  silently fall back AZERTY → QWERTY → first available; no available target keeps
  the observed panel. Refresh failures retain the active target with an error.
- No source API, historical-query, database, capture or OS-layout changes were
  necessary. Existing observed statistics and printing-filter semantics remain.

### Selector verification (2026-11-04)

- All 54 unit/API/state/importer tests pass, along with both TypeScript projects
  and targeted ESLint checks. The packaged macOS binary builds successfully.
- Browser smoke checks cover the native selector, five enabled profiles, exactly
  two panels, aligned statistics, stable source pixels, catalogue-wide scaling
  including hidden targets, both activity/scale modes, keyboard focus, preference
  reload/fallback, cache/races/refresh, isolated/all-target failures and mobile
  stacking. Desktop/statistics screenshots were visually reviewed.
- Read-only validation against keyboard 343's actual aggregate snapshot reconciled
  all five targets in both activity modes: 7,223,966 recorded events / 1,075 groups;
  4,040,915 printing actions / 314 groups. Five-target computation took about 31 ms
  for All presses and 5 ms for Printing only in this local Node run (not a browser
  performance guarantee). Target changes require no additional source requests.
- Printing-only unsupported actions remain explicit: QWERTY 5, AZERTY 0,
  Colemak-DH 261, Bépo 367, ISRT 21,799 in that snapshot. In particular, ISRT's
  unverified Option levels are not filled from another layout.
- No service reload, database write or input-source activation was performed.
  Deployment remains the user's separate `bin/reload_service` step.

The sections below preserve implementation history from the earlier three-panel
version; the selector contract and this section describe the current UI.

Implemented following the specification and subsequent implementation request.
The original specification/audit history is preserved separately.

## Boundaries and patterns

- **Functional core / imperative shell:** the pure engine in
  `src/common/src/projection/` has no React, database or network dependency.
- **Data-driven strategy:** versioned French/US profile data defines output,
  geometry, hand ownership and routes. No layout-specific rendering branches.
- **Compiler-style pipeline:** recorded-data normalization -> source decoding ->
  deterministic route selection -> modifier allocation -> reconciled key uses.
- **Legacy adapter:** `recordedAction.ts` handles embedded QMK modifier keycodes;
  database storage and old display formatting remain unchanged.
- **Explicit outcomes:** unresolved input carries a reason and source count;
  invalid routes/accounting are errors rather than silent fallbacks.
- **Request state machine:** idle/loading/ready/error states include dataset
  identity. In-flight deduplication, bounded memory caching and generation IDs
  prevent stale responses and forced-refresh races.

## Files

| Path | Responsibility |
| --- | --- |
| `src/common/src/dto/projection.ts` | Strict query, group and source contracts |
| `src/common/src/projection/profiles/generated-layouts.json` | macOS-native captured character/dead-key definitions |
| `scripts/generate-layout-profiles.swift` | Development-only TIS/UCKeyTranslate probe; never changes input source |
| `src/common/src/projection/profiles.ts` | Versioned target profiles, aliases and route catalogues |
| `src/common/src/projection/geometry.ts` | Simplified ISO/ANSI key shapes and explicit row/hand/touch-typing finger assignments |
| `src/common/src/projection/recordedAction.ts` | Legacy QK_MODS modifier normalization |
| `src/common/src/projection/decode.ts` | Typed source interpretation |
| `src/common/src/projection/routes.ts` | Fewest-modifier routes and deterministic tie-breaks |
| `src/common/src/projection/project.ts` | Counts, modifier allocation, coverage and contributions |
| `src/common/src/projection/usage.ts` | Pure row/hand/finger distributions reconciled to estimated uses, including unplaced/unassigned buckets |
| `src/service/repository/recordRepo.ts` | One grouped source query, canonical keycodes, legacy date compatibility |
| `src/server/controllers/projection.ts` | Aggregate endpoint and explicit errors |
| `src/client/src/state/projectionStore.ts` | Injectable Zustand state machine |
| `src/client/src/state/projection.ts` | Network/engine wiring and React selector hook |
| `src/client/src/components/projection/` | SVG reference keyboards, shared scale, summaries, inspection and tables |
| `src/client/src/components/projection/ProjectedUsage.tsx` | Usage distributions with existing observed-statistics meter styling; no modifier-family breakdown |
| `src/client/src/components/projection/UsageStatistics.tsx` | Shared recorded/estimated distribution rendering with desktop subgrid alignment |
| `src/client/src/lib/heatmap.ts` | Shared original palette, observed transfer function and projected normalization |

The strict endpoint is registered ahead of the existing generic keyboard-query
middleware, so unknown parameters cannot be stripped before validation.

The common package builds declarations and exposes self-contained engine runtime
JavaScript. Root/backend and client TypeScript projects are checked separately.

### All-layer recorded comparison baseline

The comparison's actual panel now renders only first-layer legends on one heatmap,
summing all source layers by physical coordinates using `mergeObservedLayers`.
`observedUsage` derives recorded distributions from the same position counts and
the selected keyboard's persisted hand/finger map. The existing source response
adds small `physicalKeys` metadata from `KeysRepo.getForKeyboard`; there are no
additional browser requests or historical stats queries. Missing assignments
remain unassigned, and the initial observed view keeps its separate layers.

All desktop panels span eight shared CSS grid rows: heading, keyboard, five
usage rows (introduction, row distribution, hand distribution, finger distribution,
notes), then inspection/diagnostics. Nested subgrids synchronize heights without
hard-coded spacers; opening key details below cannot displace the statistics.
Panels stack below 1000px. Browser tests verify alignment at 1600px and 1280px.

### Shared activity filter

`projection/printing.ts` classifies printable non-shortcut source actions through
the existing decoder. The existing grouped records query now also returns its
coordinate/action groups internally; the controller derives a compact `printing`
response variant before discarding those internal groups. There is no second
historical scan, per-event payload, new browser request or database migration.

The source printing matrix keeps each retained action's physical coordinates,
plus per-action Shift/Option participation inferred from reported modifier bits.
Side-specific modifier positions must be unique across declarations/recorded
modifier positions; missing/ambiguous uses remain unplaced. Physical participants
deduplicate within an action; embedded firmware modifiers alone do not invent
physical source keypresses. Source printed units are explicitly estimated
text-entry participation, while All presses remains actual recorded counts.

The store caches both sets of target results from one snapshot and holds an
independent, memory-only `activity` selection. Mode toggles switch all three
heatmaps, totals, diagnostics and distributions locally, preserving scale,
date/device and refresh/race semantics. Legacy source-only responses remain
usable in All presses; Printing only explains that an updated service is needed.

### One normalization for all three comparison layouts (2026-11-04)

`comparisonHeatmapScale` constructs a single immutable configuration from the
coordinate-merged source counts, both targets' physical key counts, the selected
source-event reference total and linear/log mode. `LayoutComparison` memoizes it
and passes the same object to all three renderers. `comparisonHeatmapData`
applies the same transfer/min/max to matrix points and target geometry points.
Unplaced uses do not inflate the maximum, and zero-count positions do not paint.

`HeatmapComponent` accepts this configuration for comparison but defaults to its
legacy per-layer normalization on the standalone observed page. The comparison
path no longer clamps transformed negative maxima to zero or substitutes a
different total for the source. The shared scale control/legend now describes
all three layouts. Browser tests compare isolated count colors as exact RGBA
values across all three canvases in both modes, check the source-inclusive
maximum, and verify source repainting without extra requests or stats changes.

## Data flow

`GET /api/keyboards/:keyboardId/projection-source?date=YYYY-MM-DD`

The selected date is optional. One SQL aggregation returns keycode + modifier
bits + action type + count. Source totals are derived from the same result, then
validated. No per-event arrays or write queries are used.

One cached response feeds both target projections. The comparison component is
conditionally mounted (not just hidden by the existing Tabs component), so no
projection request occurs on the initial observed view. Scale changes are local.
The existing Refresh action also refreshes the active projection. Cache and view
preferences are memory-only; no polling is added.

## Verification performed

- `npm test`: native-profile fixtures, counting/recipes, embedded modifiers,
  standalone modifier exclusion, shortcuts, unknown input, missing sides, keypad
  locale behavior, accounting, empty states, API filtering/errors and store races.
- `npm run typecheck`: backend and frontend checks, rebuilding shared contracts.
- `npm run build`: shared package, client assets, server bundle and macOS executable.
- Isolated headless Chrome with synthetic intercepted API responses: verified
  lazy loading, one projection fetch despite StrictMode, both keyboards, local
  scale changes, focus inspection, cache reuse, manual refresh, fetch errors/retry
  and a 390px viewport with no page-level horizontal overflow.
- Read-only historical check: about 7.2 million Technik events collapsed to 1,075
  groups. One sampled aggregate query took 334 ms; French/US projection took
  8/7 ms. Sampled base-action coverage was 99.87% / 99.68%. These are diagnostic
  snapshots, not stable expectations as recording continues.

All automated API tests use in-memory SQLite. The real-history check opened the
database with SQLite `OPEN_READONLY`. Browser checks did not start HID capture
or change/reload the running launch agent.

## Intentional limits

- Ordinary source dead-key composition remains unresolved; only the four
  confirmed custom aliases imply named literal glyph actions.
- Only literal circumflex/backtick/tilde get target commit-Space recipes, never
  as shortcut substitutes.
- Complete source application text and modifier holds cannot be reconstructed.
- Missing Right Control participation remains visible by family rather than
  being silently moved to Left Control on the compact reference.
- The existing input-label formatter and unrelated capture/statistics code are
  not rewritten. Existing caller/user changes are preserved.

The executable is built; applying it to the live launch agent requires a reload.
No service reload is performed as part of the implementation verification above.

## Presentation revision following user feedback

- Added the actual 4×12 ortholinear source keyboard beside the two projections.
- Reused the existing observed heatmap component per recorded layer; tests compare
  its canvas pixels between the original and comparison views.
- Replaced flat blue key fills with the same heatmap.js palette and blurred
  renderer, rendered beneath transparent SVG outlines for the standard layouts.
- Removed the separate blue/card styling and reused existing neutral controls,
  borders, fonts and accent variables. Logarithmic projection mode is now initial.
- Added actual matrix/layout metadata to the same source response. Position counts
  and grouped actions come from one SQL aggregation; a small layout lookup supplies
  the same labels as the original page. No additional frontend request is needed.
- Source-event totals and the observed matrix are validated against each other.
  Recorded presses keep their original per-layer scale and are explicitly distinct
  from estimated projected uses.
