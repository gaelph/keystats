# Layout projection — superseded draft and interview notes

Status: **Superseded.** This preserves the initial proposal and interview decision
history, including choices that were later changed. The consolidated requirements
are in `docs/specifications/layout-projection.md`; do not implement from this file.
Date: 2026-11-02

## 1. Purpose

Let a user answer: “Where would my recorded typing workload fall if I used
another keyboard layout, such as AZERTY or QWERTY?”

This is a counterfactual projection of recorded input, not an observation of
typing on the target layout and not a reconstruction of text entered into apps.
The feature must not imply that it predicts typing speed, accuracy, comfort,
health, or proficiency after switching layouts.

## 2. Confirmed intent and provisional scope

Confirmed by the conversation:

- Use existing Keystats data to display a projected heatmap.
- Compare layouts such as AZERTY and QWERTY.
- Transpose the interpreted input workload, rather than just relabeling the
  existing physical positions.
- Specify the feature and resolve ambiguities before implementation.

Everything below labeled “proposed” is a recommendation, not a user decision.

### 2.1 Approved decisions — interview round 1

- **D01:** All-key physical workload, not a character-only feature. The exact
  counting unit and treatment of hypothetical modifier actions are still open.
- **D02:** Standard reference keyboards, not the recording keyboard's matrix.
- **D03:** Initial targets: macOS French AZERTY and macOS US QWERTY.
  The precise standard keyboard size/ANSI/ISO outlines are still open.
- **D04:** Source input layout is macOS **French**, not French Numerical.
- **D05:** User confirms no relevant historical OS source or firmware character
  mapping changes for the intended history.
- **D21:** User confirms no relevant host-side character remapping.
- **Historical uncertainty policy:** Warn and continue using the declared source
  assumption if some mapping cannot be recovered; never change historical data.

This supersedes the character-only first-release recommendation in the initial
draft. Sections 5.2–5.4 currently retain that initial proposal for review; they
must be rewritten after the physical-workload counting policy is agreed. Their
character-only exclusions and conservation equation are **not approved rules**
for the requested all-key feature. Synthetic target actions, if chosen, require
separate input and output accounting rather than conservation of press counts.

### 2.2 Approved decisions — interview round 2

- **Counting model:** Recorded-event replay. Reproject recorded base actions;
  preserve recorded modifier-event counts. Do not synthesize target modifier
  presses or claim to reconstruct an actual alternative-layout session.
- **D08:** Shortcut base keys follow their French letter/symbol identity rather
  than retaining raw HID positions. Which modifier state defines a shortcut's
  identity still needs a precise rule.
- **D03:** Compact Apple reference keyboards. Exact model/key inventory remains
  open; no numeric keypad can be assumed available.
- **Unmatched actions:** List QMK layer controls, macros and other actions without
  a standard equivalent as unmapped, preserving their recorded totals.
- **D12:** Direct routes only, including supported direct modifier combinations;
  no target compose recipes or transliteration. Source dead-key sequences cannot
  be reconstructed and need explicit handling in the finalized rules.
- **D13:** Prefer the available target route requiring the fewest modifiers.
  Equal-cost routes need a deterministic profile-level tie-breaker.
- **D14:** Merge ordinary actions from all source QMK layers by interpreted action.
- **Modifier-side preference:** Opposite-hand convention was selected for any
  hypothetical synthetic demand. Recorded-event replay does not create such
  demand, so this preference has no effect unless the counting model changes.

The interview must confirm the concrete consequence of replay: a recorded Shift
event remains counted even if the target character no longer requires Shift;
a newly required target Shift is described but not counted as a new press.

### 2.3 Approved decisions — interview round 3

- **Counting model changed:** Estimate target key participation, superseding
  recorded-event replay from round 2. Target-required modifier use must be
  generated per base action; standalone source modifiers must not be added again.
  Exact counting examples and the changed denominator still need confirmation.
- **Geometry:** Simplified compact Apple reference, not a particular product.
- **Fn-based controls:** Place their workload on the relevant base key and
  annotate Fn. Whether Fn also receives estimated participation must be revisited
  because that answer was given in a question framed around replay mode.
- **Missing modifier side:** Modifier-family summary rather than silently moving
  an unavailable side-specific modifier to another physical position.
- **Shortcut identity:** Apply supported Shift/Option source interpretation while
  ignoring Command/Control for decoding. Target retention of shortcut modifiers
  must be clarified under the new estimated-participation model.
- **Persistent modes:** User does not use relevant persistent modes; assume Caps
  Lock and similar state off.
- **Source dead keys:** Approximate a source dead-key action by its literal glyph,
  e.g. circumflex as `^`. Do not reconstruct the following letter as a composed
  character. Report this approximation explicitly. This amends the original
  conservative proposal to leave all dead-key source actions unmapped.
- **Comparison:** User chose all recorded actions as a common denominator in
  replay mode. Reconfirm how to express this with generated target participation,
  whose sum can exceed the input event count.

Sections 5–8 remain an initial design proposal, not the approved physical-input
algorithm. Once the counting rules are settled, replace those sections rather
than leaving contradictory character-only and physical-workload definitions.

### 2.4 Approved decisions — interview round 4

- **Counting unit confirmed:** Estimated target-key participation. For each
  recorded non-modifier action, count its target base key and each required
  target modifier once. Do not add standalone recorded modifier events again.
- **Fn:** Count both Fn and the relevant base key for a target Fn combination.
- **Shortcut modifiers:** Preserve Command/Control, but replace source
  text-producing Shift/Option requirements with target requirements. French
  `Cmd+Shift+&` decoded as `1` becomes estimated US `Cmd+1`, not `Cmd+Shift+1`.
- **Modifier side:** Always follow the target opposite-hand convention for
  generated Shift/Option participation, regardless of recorded source side.
- **Display:** Heatmap assignable modifier uses on actual keys; show unavailable
  side-specific uses separately. Modifier-family summaries are roll-ups, never
  additional uses. Allocation and family totals must reconcile.
- **Scale units changed:** Counts only, superseding earlier percentage denominator
  choices. Both panels still share a common intensity scale. Coverage may use
  clearly defined source-action percentages, but key intensity does not.
- **Hand convention:** Conventional touch-typing split, with **Space assigned to
  the left thumb**. Opposite-hand modifiers with Space therefore prefer the
  right-side modifier, if that side is available. Sole available modifier keys
  such as Fn may be used regardless of opposite-hand preference.

### 2.5 Approved decisions — interview round 5

- Separate comparison tab, showing French and US projections only. Existing
  observed views remain unchanged and do not share the projected counting unit.
- Existing All Time/single-day filters; one currently selected recording keyboard.
- No additional projected hand/row/finger summaries in the first release.
- Shared linear/logarithmic scale toggle; default linear unless amended.
- Media/system actions are primary on the simplified function row; Fn accesses
  F1–F12. The exact reference action table must be made explicit.
- Existing manual refresh only; no new polling or window-focus refresh.

### 2.6 Approved decisions — interview rounds 6 and 7

- User confirms `0x7e4f` -> `^`, `0x7e50` -> backtick, `0x7e51` -> `~`, and
  `0x7e52` -> `’` as individual named glyph actions without duplicate output
  events. Other custom keycodes are not implicitly trusted.
- Source ordinary dead-key events are unresolved; only confirmed custom aliases
  are trusted as literal-glyph input. This supersedes the earlier proposal to
  interpret all source dead keys as literal glyphs.
- Target literal-glyph commit recipes are allowed **only** for `^`, backtick and
  `~`: dead key followed by Space when required by the target layout.
- All recipe steps and each step's required modifiers contribute participation.
  A commit Space does not inherit modifiers needed only by the dead-key step.
- Confirmed example: 10 literal `^` aliases plus 5 Space actions produce French
  circumflex 10 + Space 15; US key 6 10 + Shift 10 + Space 5.
- Target multi-step literal-glyph recipes must not be applied to shortcuts;
  shortcuts without a supported one-step route stay unmapped.
- Media-primary reference row approved: brightness down/up, Mission Control,
  Spotlight, Dictation, Do Not Disturb, previous/play-pause/next, mute/volume
  down/up. Fn plus each position produces F1–F12. Only validated semantic
  equivalents map to these actions.
- Release defaults approved: observed view initially; lazy comparison loading;
  fixed French/US panels; initial linear scale; no new preference persistence,
  editor, exports, ranges or polling; visible coverage and non-blocking warnings;
  grouped aggregate target under one second on the current dataset in an idle,
  already-running service. No implementation/deployment during this task.

### 2.7 Initial first-release scope (historical draft)

- A separate “Layout comparison” view; existing observed heatmaps stay intact.
- Two built-in, explicitly named layout variants, chosen during review.
- One selected recording keyboard; existing All Time or single-day selection.
- Standard reference keyboard geometry; specific shapes remain to be selected.
- All-key workload; modifier, shortcut, non-text and layer policies remain open.
- Side-by-side projected heatmaps with identical color scales and clear coverage.
- No new event collection, raw text logging, database migration, or background
  polling required by this feature.

Pending decisions may change the remaining proposed scope. The choice of
standard reference keyboards over the user's physical matrix is now settled.

## 3. Existing data and implementation constraints

The persisted data is daily aggregates, not an ordered event stream:

- `records`: date, modifier bitfield, count, and keymap reference.
- `keymaps`: HID/QMK keycode, classification, keyboard, layer, row, and column.
- `keys`: physical matrix position, hand, and finger assignments.
- No persisted source OS input-layout identity or layout history.
- No reliable ordered press/release history, Caps Lock state, IME state,
  application text output, or dead-key composition state.

Relevant implementation:

- `src/service/repository/recordRepo.ts` aggregates recorded counts.
- `src/lib/formatKeycodes.ts` formats current UI labels using hardcoded layout
  tables. Display labels are not an authoritative character-decoding API.
- `src/lib/keyboard_layouts/azerty_mac.ts` and `qwerty.ts` are existing label
  tables; they require independent validation before reuse as layout profiles.
- `src/client/src/components/Heatmap.tsx` renders a rectangular matrix with its
  own color transformation. A reference keyboard with variable key widths may
  need a different renderer; comparable scales cannot be assumed automatically.
- Existing keymap definitions can be updated in place. Old records refer to
  those definitions, rather than immutable historical snapshots. Projection
  cannot silently claim historical layout or firmware accuracy.

Consequences:

1. A source input-layout assumption is mandatory.
2. Projection is best-effort and must expose uncertainty and exclusions.
3. Counts cannot recreate modifier holds, key sequences, dead-key composition,
   same-finger bigrams, rolls, WPM, or timing-dependent behavior.
4. The UI must use “recorded activations” or “projected workload,” not “exact
   characters typed.” A recorded key event is not necessarily one output glyph.

## 4. Terminology and distinct models

- **Recording keyboard:** the device whose counts are selected.
- **Source input layout:** the OS mapping used to interpret recorded keycodes
  and modifiers. It is not the QMK layer map or physical geometry.
- **Target input layout:** a candidate mapping producing the interpreted output.
- **Geometry:** reference keys, positions, sizes, and optional finger assignments.
- **Layout profile:** a versioned, explicit mapping from keys and modifier states
  to supported outputs, plus reverse mappings and canonical target choices.
- **Eligible activation:** an event count that can be classified as a supported
  source character-producing base-key action under the chosen assumptions.
- **Mapped activation:** an eligible activation with a supported target position.
- **Unmapped activation:** eligible at the source but not supported at the target.
- **Excluded activation:** outside the selected input policy, e.g. a shortcut.
- **Unknown activation:** source interpretation cannot be established.

The same character can be produced at different positions or on different
layers. A reverse mapping must not depend on accidental object iteration order.

## 5. Proposed interpretation and projection rules

### 5.1 Selection

- Read counts for the selected recording keyboard and date filter.
- Do not mix keyboards implicitly.
- Collapse all recording layers after interpreting their output; retain optional
  source-layer attribution for diagnostics. Changing a QMK layer alone is not a
  character-producing activation.
- Do not modify stored counts, keymaps, or the existing observed heatmap.

### 5.2 Decode source activations

Aggregate by keycode, modifier bitfield, and classification, with any necessary
source attribution. Decode with the selected, validated source layout profile.

Proposed policies:

- Include ordinary printable letters, digits, punctuation, and literal space.
- Include Shift and source-layout-defined Option/AltGr character combinations
  only when their interpretation is explicitly supported.
- Exclude Control/Command shortcuts rather than guessing their resulting text.
  Do not treat Control+Alt as text unless a chosen profile explicitly defines it
  as AltGr and the recorded state can support that distinction.
- Exclude Enter, Tab, Backspace/Delete, arrows, function/media keys, modifier-only
  events, and layer-only events from the character heatmap. Report their totals.
- Include a mod-tap/layer-tap's character side only when already recorded as a
  plain character action; do not count its hold action again as a character.
- Treat unknown custom keycodes/macros and unsupported dead-key combinations as
  unknown source actions; do not infer what an application received.
- Case-sensitive decoding remains distinct from rendering the primary key legend.
  Supported upper/lowercase outputs may land on the same target key, but must
  not be globally lowercased as a shortcut for decoding.
- Caps Lock, IME transformations, and historical input-source switches cannot be
  reconstructed. Display these as limitations rather than inferred facts.

### 5.3 Map to target positions

- For each eligible decoded output, find its target key in the target profile.
- Add the recorded count to that key's projected workload.
- A target Shift/Option requirement is metadata, not an additional physical
  modifier press. For example, 100 exclamation marks contribute 100 base-key
  activations, not a claimed 100 separate Shift presses.
- When multiple target routes exist, use an explicit canonical route defined by
  the profile. Proposed preference: direct output, then fewer required modifiers;
  any remaining ambiguity requires a documented profile-level choice.
- Do not invent a route through unavailable firmware layers or missing keys.
- Do not silently transliterate accents, substitute punctuation, or introduce
  compose/dead-key sequences. Report unsupported outputs with their counts.
- If source inference has several possible outputs, classify it as unknown
  rather than splitting the count or choosing the most convenient output.

### 5.4 Accounting and comparison

For a selected dataset:

`recorded activations = eligible + excluded + unknown`

For each target:

`eligible = mapped + unmapped`

`sum(projected key counts) = mapped`

All categories are disjoint and counts must be conserved. Category names and
denominators must be visible in the UI and returned by the projection model.

Proposed comparison policy:

- The same eligible source population is used for both target layouts.
- Key percentage = projected key count / eligible source count.
- Target coverage = mapped / eligible; display mapped and unmapped totals.
- Both panels share the same color transfer function and maximum intensity.
  Do not rescale each panel independently and make unequal loads look equal.
- Unsupported input does not disappear into a renormalized 100% chart.
- If eligible count is zero, show an explicit empty/unsupported state, never NaN.
- A common-supported-characters-only comparison is a possible alternative,
  pending user decision, not an implicit fallback.

## 6. User experience

Proposed controls:

- Existing recording keyboard and date controls.
- Source input-layout selector, with an explicit “assumed source layout” label.
- Two target layout selectors with precise variant names, not just “AZERTY.”
- A stated reference geometry and a link/expander explaining projection rules.

Proposed display:

- Two projected heatmaps, side by side on wide screens and stacked on narrow
  screens, with a shared legend.
- Counts and percentages available by hover, keyboard focus, and touch.
- Per-key details: position, labels, projected count, source-output contributions,
  and required target modifiers where relevant.
- Coverage summary and an expandable list of unmapped outputs and exclusions.
- A persistent “Estimated from recorded key events” label and visible source
  layout assumption; do not imply a measured target-layout typing session.
- Loading, error, empty, unknown-source, and unsupported-layout states.
- Controls have accessible names, focus states, and a non-color-only data view.

Proposed non-goals for the first release:

- A layout editor or import/export format.
- A full layout recommendation/ranking engine or ergonomic score.
- Projected timing, accuracy, finger travel, same-finger sequences, or effort.
- Automatic detection of current or historical OS input sources.
- Simulating arbitrary target firmware layers or macro behavior.
- Changes to actual keyboard/OS settings or stored historical records.

## 7. Technical design proposal

### 7.1 Data and API

- Add an aggregate-only projection-source endpoint, provisionally:
  `GET /api/keyboards/:keyboardId/projection-source?date=YYYY-MM-DD`.
- Initial filters match existing All Time/single-day behavior. Additional period
  controls are a separate scope decision; do not silently ignore period input.
- Group in SQL by numeric/string keycode identity, modifier bitfield, and action
  classification. Return counts and accounting metadata, not individual records
  or arbitrary preformatted display strings.
- Keep formatting and classification separate: the current character endpoint
  formats/folds some information and is not automatically a safe source.
- Define validated request/response types in `src/common/src/dto/keyboard.ts`
  or a dedicated shared projection DTO module.
- Validate layout/profile IDs and modifier handling. Fail explicitly on invalid
  parameters rather than substituting the default layout.
- Projection and mapping profiles must be deterministic and unit-testable;
  proposed execution is client-side over the compact grouped response.
- Switching target layouts should not refetch recorded counts. Source/date or
  recording-keyboard changes must invalidate the relevant derived result.
- Cancel or disregard stale responses after a selection change. Avoid duplicate
  in-flight requests for the same dataset.
- No network transmission beyond the existing local service; no raw text or
  ordered event sequence is collected or reconstructed.

### 7.2 Layout and geometry profiles

Use explicit stable IDs and versioned mappings for:

- Source output decoding: keycode + modifier state -> supported output/action.
- Target reverse mapping: output -> canonical key + required modifiers.
- Physical/reference positions: stable position ID + geometry + labels.
- Optional finger/hand assignments, only if those derived stats are approved.

Do not reuse recording matrix row/column as reference-keyboard positions without
an explicit mapping. Do not infer a standard physical layout from USB vendor ID.

### 7.3 Performance and compatibility

- Work is proportional to distinct aggregate groups and target keys, not total
  recorded keypress count. Do not build arrays containing millions of events.
- Preserve the `records(keymapId)` index added for statistics performance.
- Reuse one source aggregate response across both comparison panels.
- Do not introduce a date cap or raw-record downloads to meet performance goals.
- Proposed API budget: under one second for the current historical dataset in an
  idle service; separately measure contention while capture is active.
- Proposed target-switch budget: under 100 ms after source aggregates are loaded
  on the user's machine. Agree reference conditions before treating as a gate.
- Existing statistics and actual capture behavior must remain unchanged.
- No historical backfill is possible for information that was never recorded.

## 8. Verification and acceptance criteria

The feature is acceptable only once unresolved product decisions are approved
and the implementation passes these checks:

1. A fixture containing known letters moves counts to their correct target
   positions; simply swapping keycap labels fails this test.
2. A nonuniform fixture projected onto the same source/target profile reproduces
   the expected reference workload, including modifier-dependent symbols.
3. Character counts are conserved according to section 5.4. Duplicated target
   routes do not duplicate workload.
4. Upper/lowercase, digits, punctuation, space, Shift, supported Option/AltGr,
   Control/Command shortcuts, and standalone modifiers have explicit fixtures.
5. Dead keys, accents, custom keycodes, unsupported target output, and missing
   source identity produce the documented warning/category, not silent guesses.
6. Plain tap outcomes and non-character hold outcomes are not double-counted.
7. Identical percentages receive identical colors in both panels. Empty datasets
   and zero denominators are safe.
8. Keyboard/date filtering matches existing records. Selection races cannot show
   one keyboard's counts under another keyboard's labels.
9. Layout names, source assumptions, geometry, coverage, and approximation are
   visible without relying on tooltips alone.
10. Mouse, keyboard, touch, narrow-screen, loading, and error paths are usable.
11. Layout profiles have independent known-output fixtures; current label tables
    must not serve as both the implementation and their only expected results.
12. No capture configuration, OS settings, historical records, or live service
    are modified by viewing or changing a projection.

## 9. Decision register — see section 2.1 for approved answers

- D01: Character-workload comparison versus all-key physical workload.
- D02: Standard keyboard geometry versus the user's 4x12/custom matrix.
- D03: Exact AZERTY/QWERTY variants, OS conventions, and ANSI/ISO geometry.
- D04: How the source input layout is chosen and persisted.
- D05: Handling historical periods containing multiple source layouts or firmware
  revisions; best-effort warning versus refusing uncertain projections.
- D06: One recording keyboard versus combining several devices.
- D07: All Time/single-day scope versus arbitrary periods.
- D08: Shortcut policy, including Command/Control and text-producing Alt/AltGr.
- D09: Inclusion of space, Enter/Tab, deletion, navigation, and other controls.
- D10: Treatment of shifted/case-sensitive output and Caps Lock uncertainty.
- D11: Target modifier requirements: metadata only versus estimated extra load.
- D12: Dead keys, composed/accented characters, and unsupported target output.
- D13: Canonical route selection when outputs have multiple target positions.
- D14: Recording-layer collapse, target layers, and dual-role-key assumptions.
- D15: Common denominator versus common-supported-only comparisons.
- D16: Display arrangement, shared scale, and difference/observed views.
- D17: Additional projected finger/hand/row statistics and their assignments.
- D18: Built-in profiles only versus custom layouts/import/export.
- D19: Preference persistence, defaults, and refresh behavior.
- D20: Acceptable performance, accuracy labels, and release acceptance scope.
- D21: Host remappers/IME transformations and the boundary of source decoding.
- D22: Projected standard-layout baseline versus observed physical-keyboard data.
- D23: Concrete expected-input/output examples and first-release acceptance.
- D24: Low/zero-coverage display or blocking policy.

## 10. Rollout proposal

1. Complete the post-writing audit and stakeholder interview.
2. Revise this document with explicit decisions and approved examples.
3. Implement validated layout profiles and the pure projection/accounting engine.
4. Add aggregate API, comparison UI, and automated fixtures.
5. Verify against the user's historical data without changing that data.
6. Rebuild/reload only when implementation deployment is authorized.

No feature implementation or service change is authorized by this specification.
