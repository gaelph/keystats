# Layout comparison: estimated target-key workload

The [selectable-layout expansion contract](layout-selector-expansion-plan.md)
supersedes this document's original fixed-target presentation and literal-only
composition scope: two panels, browser-persisted target selector (AZERTY default),
five approved registry entries, available-catalogue-wide stable normalization,
and exact-codepoint French-letter recipes bounded to one dead key plus base.
Original source assumptions/capture limitations and filtering rules remain.

Status: **Specification consolidated after audit and stakeholder interview.**
Date: 2026-11-02
Scope: specification only; implementation and deployment require a new request.

Related documents:

- [Post-writing audit](layout-projection-audit.md)
- [Superseded draft and interview notes](layout-projection-interview-notes.md)

This document is authoritative over the superseded draft. It incorporates the
latest answers to 47 questions across seven interview rounds.

Presentation revision after implementation feedback: the user additionally
requires the actual 4×12 ortholinear keyboard beside the projections, and the
existing UI styling, heatmap palette and renderer. These requirements supersede
the original two-panel/flat-per-key rendering and initial-linear defaults. The
projection counting rules are unchanged.

Usage-statistics revision: the user additionally requests projected row, hand and
finger distributions under standard touch-typing assumptions, and removal of the
modifier-family usage breakdown. This supersedes the original exclusion of those
three distributions; sequence-dependent repetition statistics remain out of scope.

Comparison-baseline revision: the actual 4×12 must show **one** heatmap, with
first-layer legends and all-layer counts summed by physical coordinates. Add
its recorded row/hand/finger distributions and align the heading, heatmap,
statistics introduction and each distribution across all three desktop panels.
This supersedes the earlier comparison requirement to display every source layer;
the initial observed page remains unchanged.

Activity-filter revision: provide a shared **All presses / Printing only** option,
initially All presses, affecting all three comparison heatmaps, totals, coverage
and distributions. Shift/Option participation used for text entry stays included.
Printing-only source modifier counts are estimates per retained action, not
recovered historical holds; see section 9.3. Earlier claims that the source panel
always displays exclusively recorded presses apply only to All presses mode.

Normalization revision (2026-11-04): all **three** comparison heatmaps must share
one normalization and range. The previous source-panel legacy normalization is
superseded in comparison only; the standalone observed page remains unchanged.

## 1. Purpose and accuracy claim

Show how recorded keyboard activity would distribute across simplified compact
Apple-style French AZERTY and US QWERTY keyboards.

The metric is **estimated target-key participation**, not actual physical press
counts, typed text, or a prediction of typing effort, speed, accuracy or comfort.
Each recorded non-modifier action generates the target key uses needed to perform
its interpreted action. A modifier held across three actions participates three
times. A supported dead-key commit recipe may generate additional base actions.

The feature redistributes interpreted actions, rather than merely changing
keycap labels at the original physical positions.

## 2. Agreed first-release scope

| Area | Requirement |
| --- | --- |
| Location | Separate “Layout comparison” tab/view |
| Initial page | Existing observed view; comparison loads only when opened |
| Source data | Currently selected recording keyboard only |
| Time filters | Existing All Time or selected calendar day |
| Source input layout | macOS **French**, not French Numerical |
| Targets | macOS French AZERTY and macOS US QWERTY |
| Geometry | Simplified compact Apple references, French ISO and US ANSI |
| Presentation | One all-layer actual heatmap with first-layer legends beside French/US projections; aligned statistics and responsive stacking |
| Metric | Estimated key-use counts; no per-key percentage mode |
| Color | Original heatmap.js palette/blur; projected linear/log toggle, initially logarithmic |
| Recording layers | Merge ordinary source actions by interpreted meaning |
| Refresh | Existing manual Refresh action; no polling or focus refresh |
| Activity filter | All presses (default) or Printing only, shared by all three panels; local toggle over one response |
| Summaries | Workload totals, row/hand/finger distributions, coverage, unmapped actions; no modifier-family usage breakdown |
| Historical uncertainty | Warn and continue; never change historical data |

Out of scope:

- Recorded-event replay as a second projection mode.
- Custom recording-keyboard geometry or target firmware/layer simulation.
- Projected same-hand/same-finger repetitions, travel or ergonomic scoring.
- Arbitrary date ranges, calendar week/month presets or combined devices.
- Layout editors, imports, exports, additional layout choices or saved preferences.
- New capture telemetry, text logging, historical backfills or database migrations.
- Changing existing observed statistics, input settings or capture behavior.

## 3. Source assumptions and data limitations

The user confirms:

- macOS French has been used throughout the intended recording history.
- No relevant host-side character remapping changes the captured interpretation.
- No relevant historical firmware character-mapping changes need reconstruction.
- Caps Lock and similar persistent input modes are not used; assume them off.

These are declared assumptions, not facts inferred from the database or UI labels.
Display the source assumption and the estimated nature of the result.

The database contains daily aggregates with keymap references and modifier bits,
not ordered events or application output. It cannot reconstruct modifier holds,
composition, IME state, input-source switching or application shortcut semantics.
Keymap definitions can also be updated in place, so immutable historical firmware
snapshots cannot be recovered from records alone. Warn about these limitations
without blocking the user's chosen history.

Known implementation references:

- `src/service/repository/recordRepo.ts`: aggregate queries.
- `src/service/models/keymap.ts`: action classification and source coordinates.
- `src/lib/formatKeycodes.ts`: existing display-label formatting, not a decoding API.
- `src/lib/keyboard_layouts/azerty_mac.ts` and `qwerty.ts`: existing label tables,
  not independently validated, complete layout profiles.
- `src/lib/custom.ts`: custom labels; only the aliases in section 5.3 are trusted.
- `src/client/src/components/Heatmap.tsx`: existing matrix-specific renderer with
  independently scaled/log-transformed values; unsuitable for direct reuse without
  satisfying the shared-scale and geometry requirements below.

Do not silently fix unrelated existing label, collection or statistics behavior
as part of implementing this feature.

## 4. Terminology and counting unit

- **Source event count:** the count persisted for an interpreted recording action.
- **Source modifier-only event:** an individual modifier/hold action recorded
  separately from a base action. It is not added to projected participation.
- **Source base action:** any recorded non-modifier action, including characters,
  shortcuts, named controls and unknown/custom actions.
- **Target route:** one or more steps performing a supported interpreted action;
  a step has one base key and its required modifiers.
- **Projected key use:** one participating physical key in one route step.
- **Unmapped source action:** a source base action lacking a supported target route.
- **Unplaced modifier use:** required modifier participation that can be counted
  by family but cannot be assigned to a reference physical key.

For a source group with count `c`, each participating key in each route step
receives `c` uses. A key is counted once per step even if multiple requirements
refer to that same physical key. Distinct steps remain distinct uses.

Standalone source modifiers are not added again: their target participation is
derived from the modifier state and meaning of each base action. This means
isolated modifier presses without a base action have no projected equivalent.
Report their source count as intentionally not projected, not as lost data.

## 5. Decode source actions

### 5.1 General rules

1. Read counts for exactly the selected recording keyboard and time filter.
2. Normalize keycode identity, modifier bitfield and keymap classification without
   using display strings such as `CTRL A`, `???` or an icon as semantic input.
3. Recognize actual modifier/dual-role hold outcomes before decoding base actions.
   Character taps already recorded as plain actions remain ordinary base input.
4. Merge source layers after interpretation; do not count layer controls as text.
5. Interpret supported printable output through a validated macOS French profile,
   using recorded Shift/Option state, with Caps Lock assumed off.
6. Preserve case, accents, literal space, and Unicode punctuation identity.
   Do not globally lowercase, strip accents or replace curly quotes with ASCII.
7. Include named non-text actions: Enter, Tab, Backspace, forward Delete, arrows,
   Home/End, Page Up/Down, Escape, function/media/system actions and known controls,
   where a validated semantic mapping exists.
8. Unknown macros, layer actions, firmware controls and other unsupported input
   stay visible in the unmapped list. Never infer their output from their labels.

### 5.2 Shortcut and non-text modifier rules

For printable base actions carrying Command and/or Control:

- Ignore Command/Control only while decoding the French base symbol.
- Apply supported source Shift/Option decoding to identify that symbol.
- Preserve Command/Control requirements in the projected shortcut.
- Replace source text-producing Shift/Option with the target symbol's requirements.
- Do not infer what any application does with the resulting shortcut.

Confirmed example: French `Cmd+Shift+&` is interpreted as the symbol `1` with
Command. On US QWERTY it projects to `Cmd+1`, not `Cmd+Shift+1`.

For named non-text actions, retain their meaningful recorded modifier families:
Shift+Tab remains Shift+Tab, Option+Backspace remains Option+Backspace, etc. Add
target route requirements such as Fn without counting the same modifier key twice.

An Option-only printable chord follows the selected French output profile; the
system cannot determine whether a particular application treated it as a shortcut.
This limitation is part of the declared estimate, not an application heuristic.

### 5.3 User-confirmed custom glyph aliases

| Recorded custom keycode | Interpreted glyph |
| --- | --- |
| `0x7e4f` | `^` |
| `0x7e50` | U+0060 GRAVE ACCENT (backtick) |
| `0x7e51` | `~` |
| `0x7e52` | `’` — U+2019 RIGHT SINGLE QUOTATION MARK |

The user confirms that these are individual named glyph actions and that the
recorded custom action does not duplicate another reported output event.
Treat them as declared glyph aliases, not inferred text from arbitrary macros.
Other historical/custom codes are not automatically aliases, even if a display
table contains a similar label. Preserve Command/Control if an alias occurs in a
shortcut; apply the shortcut target-route restrictions below.

### 5.4 Ordinary source dead keys

Ordinary source dead-key events are **unresolved source actions**. Do not turn
them into literal glyphs or attempt to combine them with later recorded letters
or Spaces. The event order and composition state are not available.

Following independently recorded actions are handled independently; do not guess
whether a Space committed a dead key or was literal whitespace. Show an explicit
composition limitation. Only the confirmed aliases above establish literal
circumflex/backtick/tilde intent for this release.

## 6. Map interpreted actions to target routes

### 6.1 Supported routes

- Use the target profile's supported one-step character or named-control route,
  including validated Shift, Option or Fn combinations.
- Prefer the available route with the fewest required modifier uses. Do not
  invent a keypad, key, firmware layer or macro missing from the target geometry.
- For equal modifier cost, prefer fewer steps, then a documented profile-specific
  canonical priority, then stable position IDs. Object iteration order is not a
  route-selection rule.
- Target keypad absence does not forbid mapping known keypad text/Enter actions
  to their supported main-section semantic equivalents.
- Unknown targets and unsupported output remain unmapped; no transliteration.

### 6.2 Explicit literal-glyph recipe exception

For text-like literal `^`, backtick and `~` actions only, allow a validated
target recipe of **dead-key step, then Space commit step**, when the target layout
requires it. This is an explicit exception to otherwise one-step target routes.

- Count the dead-key base key, its required modifiers, and the commit Space.
- Compute modifiers per step. A commit Space does not inherit Shift/Option used
  only to produce the preceding dead-key action.
- Prefer a supported lower-modifier-cost route when one exists on that target.
- Do not add this exception for other dead-key glyphs, composed letters such as
  `ê`/`é`, arbitrary compose sequences, IMEs or macros.
- Do not use multi-step text recipes for shortcuts. If a shortcut has no supported
  one-step target route, list the whole source action as unmapped.

The same input can therefore generate different base-key and modifier totals
on the two layouts. This difference is part of the feature, not a counting bug.

### 6.3 Modifier allocation

- Generate target-required Shift/Option participation using the **opposite target
  hand**, regardless of the recorded Shift/Option side.
- Use conventional touch typing: 5/T/G/B belong to the left hand; 6/Y/H/N to the
  right. **Space belongs to the left thumb.** Reference profiles must explicitly
  assign the remaining base positions; arrows/navigation are right-hand keys.
- Preserve explicit recorded sides for retained Command/Control requirements.
  Distinct explicitly retained left/right keys remain distinct participations.
- Use a sole available required key such as Fn regardless of hand preference.
- If a required side-specific modifier is absent, do not silently substitute its
  other side. Count the required participation in an unplaced modifier-family
  bucket; retain a valid base route and disclose incomplete physical placement.
- Show assignable modifier participation on physical keys. Family summaries are
  roll-ups of assigned and unplaced uses, never extra uses added to the total.

## 7. Reference keyboards and named controls

Use versioned profiles with stable position IDs, explicit key outlines/sizes,
source outputs, target routes and the hand assignments needed by section 6.3.
These are **simplified Apple references**, not exact product reproductions or
predictions of current macOS preferences.

Both include Escape, a 12-position function row, main typing section, Tab,
Caps Lock, Backspace, Enter, left/right Shift, Fn, left Control, left/right
Option and Command, Space, and the compact arrow cluster. French uses an ISO
outline and its extra key; US uses ANSI. There is no numeric keypad, right
Control, dedicated Home/End/Page keys, Touch ID input, or assumed Power/Eject key.

Named control routes:

| Action | Reference route |
| --- | --- |
| Backspace | Backspace |
| Forward Delete | Fn + Backspace |
| Home / End | Fn + Left / Fn + Right |
| Page Up / Page Down | Fn + Up / Fn + Down |
| F1–F12 | Fn + corresponding function-row position |

Media/system-primary function row:

| Position | Primary semantic action |
| --- | --- |
| F1 / F2 | Brightness down / up |
| F3 | Mission Control |
| F4 | Spotlight |
| F5 | Dictation |
| F6 | Do Not Disturb |
| F7 / F8 / F9 | Previous / Play-pause / Next |
| F10 / F11 / F12 | Mute / Volume down / up |

Only source actions with independently validated semantic equivalents map to
these system routes. A custom macro label resembling a system action is not
sufficient. Unsupported controls remain unmapped rather than being guessed.

## 8. Accounting, coverage and scale

Keep source-event accounting separate from generated key-use accounting.

For the selected input:

`source events = standalone modifier events + source base actions`

For each target:

`source base actions = actions with supported base routes + unmapped actions`

`projected key uses = sum(physical key uses) + unplaced modifier uses`

Recipe expansion means one supported source base action may generate several
base-key and modifier uses. Projected totals are not required to equal source
event totals or each other. Do not add source standalone modifiers or family
roll-ups to generated totals.

If a source base action has no valid target route, generate no guessed partial
chord for it; retain its full source count and original chord information in the
unmapped list. A supported base route with an unplaceable modifier side is
different: its modifier uses are counted in the separate family bucket.

Display **base-action coverage** as supported source base actions divided by all
source base actions, with numerator and denominator. This does not mean full
physical placement or exact text reconstruction. Separately disclose unplaced
modifier uses and approximated literal-glyph recipe counts.

Projected heatmaps display counts, not per-key percentages. Let `M` be the
maximum physical key count across the coordinate-merged source and both
projections, and `T` the selected source-event total (retained source actions in
printing-only mode):

- Linear intensity: `count / M`.
- Log intensity follows the original page's transfer function:
  `log(1 + 200 * count / T) / log(1 + 200 * M / T)`.
- If `M = 0`, all intensities are zero.

One scale toggle affects all three panels. Use the original heatmap.js
blue–green–yellow–red gradient and blurred point renderer, with one shared range
and reference total, not each layout's recorded/estimated participation total.
Family roll-ups and unplaced buckets do not inflate the color maximum.
Zero-activity points are not painted in any comparison panel. Log mode is named
in the legend. Do not clamp negative transformed maxima to zero: this legacy
behavior flattened the source heatmap when all log values were negative.

The actual recording keyboard reuses the existing observed renderer, but receives
the exact same normalization configuration as both target renderers, applied to
one matrix summed across every source layer by coordinates.
Only first-layer legends are displayed; missing legends remain blank, not filled
from a different layer. The initial observed page keeps its per-layer heatmaps
and legacy normalization. The comparison legend explains that all three share
one count-to-intensity mapping, although recorded presses and estimated
participation remain different metrics. Blurring can blend neighboring
hotspots, so exact counts remain available independently of pixel colors.

## 9. User experience and states

- Preserve the existing observed view as the initial page and its current data.
- Add a clearly separate Layout comparison tab/view containing the actual
  recording keyboard and the two fixed French/US projection panels. Preserve
  its 4×12 ortholinear geometry, first-layer legends and one all-layer heatmap. Do not add
  target/source dropdowns in v1.
- Label the source assumption “macOS French” and metric “Estimated key uses.”
- Explain that held modifiers count once per participating base action, literal
  recipes can add commit Spaces, and the result is not measured keypress effort.
- Show per-target totals, row/hand/finger distributions, source-action coverage,
  unplaced-use diagnostics and expandable unmapped/action-approximation details.
- Per-key hover/focus/tap details show position, legends, raw count, contributing
  actions and route/modifier explanations. Do not require hover to access data.
- Row/hand/finger distributions reuse the observed statistics' meter styling.
  Include recorded distributions beneath the actual keyboard. Shared grid rows
  align panel headings, heatmaps, usage introductions and row/hand/finger sections,
  even when names wrap or legends differ. Put key inspection/coverage details
  after the statistics so expanding them cannot move one panel's stats. Stack
  complete panels on narrow screens. No ranking or difference heatmap.
- Projected linear/log toggle starts in logarithmic mode to match the original
  heatmap presentation. No new preference persistence.
- Unknown/unsupported input is visible at any count; no arbitrary cutoff or
  silent omission. Coverage/approximation warnings are informative, not blocking.
- A target with zero supported actions shows an explicit unsupported/empty result
  with its unmapped counts, not a seemingly successful all-zero keyboard alone.
- If there are no source base actions, distinguish that from a request failure;
  standalone modifier counts may still exist as unprojected context.
- Provide loading, fetch-error and retry states. A source-selection change must
  never show old counts under the new keyboard/date label as if current.
- Support responsive layout, keyboard access, accessible labels and a non-color
  tabular alternative. Existing refresh controls remain the user entry point.

### 9.1 Projected usage distributions

Derive distributions locally from target `keyUses`, not observed hand/finger
aggregates. No new requests, capture data or database work is required.

- Row categories: function/Escape, number, top letter, home, bottom letter,
  Space/bottom modifiers, arrows, and unplaced. Include modifiers according to
  their physical row; home-row percentage includes controls on that row.
- Hand categories: left, right, unplaced, using the declared target geometry.
- Fingers: standard touch-typing columns (left index covers 4/5, R/T, F/G, V/B;
  right index covers 6/7, Y/U, H/J, N/M in QWERTY physical positions), pinkies for
  outer punctuation, Escape/Tab/Caps/Enter/Backspace/Shift, left thumb for Space,
  the corresponding thumb for Command/Option, and left pinkie for Control/Fn.
  AZERTY uses the same physical assignments, not QWERTY letter assignments.
  ISO's extra left key uses the left pinkie. Function/media keys and arrows have
  no fixed touch-typing finger; display them as unassigned rather than guessing.
- Denominator: **all estimated key uses**, including generated modifiers and
  unplaced uses. Keep unplaced uses in row/hand buckets and the unassigned finger
  bucket so each distribution reconciles to the estimated total. Zero totals
  display 0.00%, never NaN. Retain zero-count categories for stable comparison.
- Retain coverage and unplaced-key diagnostics, but remove the modifier-family
  usage breakdown. This does not remove modifiers from projection routes/counts.
- Do not infer same-hand/same-finger repetition or alternation: historical daily
  key frequencies and source repetition summaries do not preserve target event order.

### 9.2 Recorded comparison baseline

- Sum every source layer into one matrix keyed solely by physical row/column.
  Do not match keycodes or interpret first-layer legends as the actions recorded.
  Positions present only in a later layer still contribute, with a blank legend.
- Derive distributions from that same matrix and denominator (all recorded
  presses). Use physical row indices 0–3 as top/home/bottom/thumb, matching the
  main page, regardless of which glyph appears on a particular layer.
- Use persisted `keys.hand` and `keys.finger` assignments for the selected keyboard,
  the same configuration used by observed statistics. Never infer them from target
  touch typing or the first-layer glyph. Return these small physical-key metadata
  alongside the existing aggregate, not through new frontend requests or separate
  historical aggregate scans. Missing assignments remain unassigned; all counts
  reconcile to the recorded total. Extra physical rows use the other-row bucket.
- Reuse the same distribution categories/order, meter renderer and shared desktop
  grid tracks as the target panels. Clearly label recorded versus estimated units.

### 9.3 Printing-only activity filter

- A shared two-state control selects All presses (default) or Printing only.
  State is memory-only, survives comparison-view reopening, and is independent
  of device/date/scale. Changing activity never fetches data or changes the main
  observed page. Refresh obtains both modes for the same device/date snapshot.
- Classify **recorded actions**, before layer merging and target projection,
  using the same source decoder as the engine, not first-layer display labels.
  Keep known printable glyphs (including ordinary/nonbreaking Space, digits,
  punctuation, keypad text and confirmed aliases) without Command/Control.
  Consume normalized embedded QMK modifiers when classifying shortcuts/text.
  Exclude navigation, editing, Enter/Tab, function/media, Cmd/Ctrl shortcuts,
  standalone modifiers, unknown macros/layer actions and unresolved source dead
  keys. Exclusions are not target-unmapped actions; show retained/excluded counts.
  Printable actions unsupported on a target still appear in that target's
  unmapped/coverage diagnostics. No application output or composition is inferred.
- Target counts retain all route-required Shift/Option participations and literal
  dead-key commit steps, including commit Space. Do not strip modifiers from a
  retained target route or reuse recorded standalone modifier hold counts.
- For the source 4×12, keep the recorded physical coordinates of retained text
  actions. Add left/right Shift/Option participation from their **reported**
  modifier bits once per retained action. Firmware-embedded modifiers alone do
  not invent a second physical source keypress. Deduplicate physical participants
  within an action. Standalone modifier records are not added again: aggregate
  history cannot identify which holds served printing versus navigation/shortcuts.
- Locate source modifier positions from explicit modifier declarations and
  recorded modifier-only positions, across all layers. Repeated declarations at
  one coordinate deduplicate. Draw a modifier only when its side-specific
  coordinate is unique. Ambiguous/missing coordinates remain unplaced rather than
  being allocated by frequency, target hand policy or first-layer glyph.
- Label source printing-mode totals as text-entry uses with **estimated
  modifiers**, and explain the breakdown into recorded actions plus modifier
  participation. The source matrix and unplaced uses reconcile to this total;
  distributions include unplaced uses. All presses keeps original recorded totals.
- Return both modes in one aggregate response from the same coordinate-aware
  query. Keep coordinate/action groups server-side, rather than downloading raw
  events or issuing another historical aggregate scan. Source groups reconcile
  to retained actions, independently of added modifier participation. Validate
  retained + excluded event counts against the original selected event count.
- Explain that application-specific Option shortcuts, actual text insertion and
  source dead-key composition cannot be determined. Zero eligible actions is an
  explicit empty printing selection, with safe zero statistics, not a load error.
  If an older service lacks printing data, request reload/refresh rather than
  silently showing all activity under a printing-only label.

## 10. API and implementation boundaries

### 10.1 Aggregate source endpoint

Proposed route:

`GET /api/keyboards/:keyboardId/projection-source?date=YYYY-MM-DD`

Omitting `date` means All Time. Validate the keyboard ID and date, and reject
unsupported filter parameters rather than silently ignoring them. Follow the
existing local-calendar-day meaning; do not shift dates through UTC. Match
relevant legacy padded/unpadded month representations without rewriting records.

Return lossless groups of keycode identity, recorded modifier bits, keymap
classification and summed count, plus source totals. The SQL query groups stored
records, not individual keypress events. Selected-device attribution must follow
the same records/keymaps ownership as existing statistics; do not imply recovery
of orphaned or already-lost historical data.

Suggested response contract, finalized in the shared DTO during implementation:

```typescript
interface ProjectionSource {
  keyboardId: number;
  date: string | null;
  sourceEventCount: number;
  observed?: {
    keymaps: KeymapsBody["keymaps"];
    keymapUsage: number[][][];
    totalKeypresses: number;
    physicalKeys?: { row: number; column: number; hand: number | null; finger: number | null }[];
    unplacedUses?: number;
  };
  printing?: {
    groups: ProjectionSource["groups"];
    sourceEventCount: number; // retained recorded printing actions, not modifier participation
    excludedEventCount: number;
    modifierParticipationCount: number;
    observed: NonNullable<ProjectionSource["observed"]>; // total = actions + estimated modifiers
  };
  groups: {
    keycode: string; // canonical hexadecimal identity, not a display label
    modifiers: number;
    type: string; // validated existing keymap classification
    count: number; // nonnegative safe integer
  }[];
}
```

Canonicalize equivalent keycode spellings and preserve semantic distinctions
between action types. Do not use the preformatted existing character endpoint
as the authoritative projection source or expand counts into per-event arrays.
Source decode/coverage accounting is performed by the projection engine, not
invented by a layout-agnostic raw aggregate endpoint.

The current server includes `observed` metadata in that same response: actual
position counts, current layout labels and configured physical-key assignments.
Count positions and projection groups
are derived from one coordinate-aware aggregate so they reconcile and cannot
belong to different date/device selections. The optional field preserves older
input fixtures; if absent, the actual-layout panel explicitly reports that the
updated service is needed rather than displaying stale global statistics.
The current server also includes the compact `printing` variant, derived from
the same query's action/coordinate groups without sending those groups to the
browser. Its source matrix includes estimated modifier participation; unplaced
uses are explicitly carried and included in its usage denominator. The original
`observed` variant remains strictly recorded counts with no unplaced inferred uses.

### 10.2 Profiles, pure engine and frontend state

- Create a pure, deterministic decode/route/accounting engine, with shared DTOs
  and independently testable profiles. Client-side execution over the compact
  aggregate response is the proposed implementation boundary.
- Use explicit profile IDs/versions for macOS French ISO and US ANSI. The source
  profile, custom aliases, modifier policy, geometry and recipe policy must be
  identifiable for diagnostics. Validate output mappings independently of the
  existing tables; their known label inconsistencies cannot become test oracles.
- Validate source and target modifier/output combinations against reliable layout
  definitions. A missing mapping is an explicit unsupported state, not a fallback
  to QWERTY, a guessed glyph or the first matching object entry.
- Load aggregates lazily on first opening the comparison view. Reuse one source
  response across both projections and both scale modes.
- Deduplicate identical in-flight requests, including development StrictMode
  lifecycles. Ignore/cancel stale requests after keyboard/date changes.
- Cache derived results for the active dataset; changing scale does not refetch.
  Reuse unchanged data when switching views. Manual Refresh invalidates/refetches
  the active comparison dataset; no polling or focus-triggered requests.
- Do not trigger additional observed-statistics queries merely to calculate a
  projection, or alter the existing observed refresh semantics beyond necessary
  integration with the current Refresh action.
- Show structured unmapped reasons, source counts and modifier/recipe allocation
  diagnostics so count conservation and coverage can be inspected.

### 10.3 Performance, privacy and compatibility

- Work scales with distinct aggregate groups and reference keys, not millions of
  recorded presses. Keep the existing `records(keymapId)` index.
- Target: grouped API response under one second on the current historical dataset
  in an idle, already-running service. Measure active-capture contention separately;
  this target excludes binary startup/decompression time.
- Scale toggling and recomputation use loaded aggregates without network work.
- Only the local service is used. No remote analytics, ordered event collection,
  raw text history, database migration or modification of stored counts is needed.
- Derived glyph frequencies are aggregate interpretations, not reconstructed text.
- Viewing a projection must never change firmware, host layouts or capture state.

## 11. Required examples and tests

| Input/context | Expected result |
| --- | --- |
| French letter `a`, count 100 | French A position 100; US A position 100, not unchanged raw HID position |
| French digit `1` recorded with Shift, count 10 | French number-row base 10 + opposite-hand Shift 10; US 1 key 10, no generated Shift |
| Separate recorded source Shift event, count 10 | Report as unprojected source modifier context; do not add another 10 to generated Shift |
| Shift held across three actions | Three target Shift participations if each target action requires Shift; no attempt to infer a single hold |
| French `Cmd+Shift+&`, decoded as `1` | US 1 + retained Command, not US Shift+1 |
| Plain Page Up, count 10 | Up 10 + Fn 10 |
| Literal Space, count 5 | Target Space 5; Space is left-thumb for opposite-hand allocation |
| Confirmed literal `^` alias, count 10, plus Space 5 | French circumflex 10 + Space 15; US 6 key 10 + Shift 10 + Space 5 |
| Target dead-key step requiring Option | Option counted for that step only; commit Space does not inherit it |
| Confirmed `’` alias | Preserve U+2019; never silently turn it into ASCII apostrophe |
| Ordinary source dead key | Unmapped/unresolved, not a completed literal or inferred composed letter |
| Shortcut needing only a target dead-key commit recipe | Unmapped whole shortcut; never invent a Command+Space commit chord |
| Right Control required on compact reference | Base route may remain supported; modifier-family bucket discloses unplaced Right Control use |
| Source F1 | First reference top-row position + Fn, because media/system action is primary |
| Unknown firmware layer/macro action | Original source count appears as unmapped; no guessed Fn or text mapping |

Additional acceptance checks:

1. All input events reconcile into standalone modifiers and base actions; all
   base actions reconcile into target-supported and unmapped categories.
2. Total key uses reconcile with physical keys plus unplaced modifier buckets;
   modifier roll-ups and recipe summaries do not double-count totals.
3. Duplicate source positions/layers merge without losing or multiplying counts.
4. Fewest-modifier route selection, equal-cost tie-breaks and missing keys are
   deterministic and covered by independent fixtures.
5. All three comparison renderers receive the same transfer, palette, radius,
   reference total and range. Equal isolated counts produce equal canvas RGBA
   values in linear and log modes. The source's maximum participates in the
   shared range, even when it exceeds every projected key. The scale toggle
   repaints the source as well as both targets, without changing statistics.
   The actual canvas uses the original observed component with combined position
   counts, while the main page retains separate layer counts. Only one actual
   comparison canvas is rendered with first-layer legends, even with many layers.
   Zero data is safe, and toggling causes no source refetch.
6. Keyboard/day/All Time filtering is correct, including legacy date formats;
   selection races and manual refresh cannot mix datasets.
7. The two layout profiles include validated uppercase/lowercase, digits,
   punctuation, Option/Shift combinations, named controls and the three explicit
   literal-glyph recipe exceptions; unsupported mappings are deliberately listed.
8. Loading, errors, retry, all-unmapped and modifier-only input remain intelligible.
9. Counts, metric labels, source assumptions, recipe approximations and incomplete
   physical placement are available on keyboard, touch and narrow screens.
10. The feature causes no changes to observed counts, capture, historical data,
    source layout settings, preferences or live services merely by being viewed.
11. Recorded and estimated row/hand/finger distributions each reconcile to their
    own denominator; configured source fingers must not be replaced by target
    touch-typing guesses. All three statistics sections align at desktop widths,
    including after key inspection opens; mobile stacks without page overflow.
12. Activity toggles update all three panels without a request, preserve scale
    and view/date selection, remove shortcuts even at shared printing coordinates,
    retain source/target Shift/Option participation, handle zero printing data and
    leave All presses and the main observed view unchanged.

## 12. Decision precedence and implementation authorization

The initial character-only proposal, recorded-event replay, percentage heatmap
normalization, and unrestricted source dead-key glyph approximation were all
superseded during the interview. None is a second supported mode in this release.

Final decisions are encoded in this document. The audit and interview notes
preserve why they changed. Remaining implementation work includes verifying full
profile data and writing fixtures; that is not permission to invent missing
product rules, guess glyphs, or broaden the agreed scope.

No feature implementation, build, migration or deployment is authorized by this
specification task.
