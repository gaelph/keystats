# Selectable comparison layouts — plan and decision register

Date: 2026-11-04
Status: **Product contract complete after five interview rounds and final audit.
Implementation requested and completed; verification results are recorded in the
implementation notes.**

This extends the existing layout-comparison specification. Confirmed decisions
below supersede the fixed three-panel/fixed-two-target presentation and explicitly
extend target-side French character composition. Other existing behavior remains
in force. Sections 1–5 and the closed decision register are the consolidated
contract; interview notes preserve the history, not outstanding questions.

## 1. Agreed outcome

The user wants to compare the observed keyboard with a layout chosen from a
dropdown, initially offering QWERTY, AZERTY, Colemak, Bépo and ISRT. Two visible
keyboards are preferable to three; a larger side-by-side catalogue is not wanted.

Presentation:

- Exactly two panels: the observed recording keyboard fixed on the left, and
  one selected target on the right. No optional third panel or target-vs-target
  comparison in this change.
- One accessible native select, labeled “Compare with”, above the panels; no
  search, multi-select, layout editor or geometry picker.
- Menu order: **QWERTY, AZERTY, Colemak-DH, Bépo, ISRT**. Show the exact variant
  and provenance in the selected target panel, not an ambiguous generic Colemak.
- Default: **AZERTY**. Remember one target browser-wide across reloads and
  recording keyboards; storage failure falls back to memory. Do not persist
  other controls or change the initial application tab.
- Keep all five entries visible. An unverified/failed profile is disabled with an
  accessible explanation near the selector. Partial availability is acceptable;
  do not silently replace a missing profile with a guessed/hybrid mapping.
- Preserve aligned keyboard/totals/statistics sections, existing styling and
  two panels stacked observed-first on narrow screens.
- Changing the target updates its heatmap, total, row/hand/finger statistics,
  coverage, unmapped actions, profile notes and key-inspection data together.
  Reset obsolete target-key inspection, but keep focus on the dropdown.

The user subsequently authorized implementation. Service reload remains a
separate user action; no capture/settings changes are part of this feature.

## 2. Existing behavior to preserve

Unless explicitly overridden:

- Original observed-statistics page remains unchanged and remains the initial
  application view. This feature stays inside Layout comparison.
- Source interpretation remains macOS French with the confirmed firmware aliases.
  The dropdown selects a hypothetical target, never the recorded input source.
- The observed 4×12 uses first-layer legends and counts summed across all layers
  by physical coordinates. Its hand/finger assignment remains its stored map.
- Keep All presses / Printing only, including Shift/Option participation and
  explicit estimated source modifiers/unplaced source positions in printing mode.
- Keep row/hand/finger distributions, counts, coverage and unmapped diagnostics.
  Do not add same-finger predictions, repetition collection fixes, scoring,
  rankings, travel calculations, delta charts or new statistics in this change.
- Keep shared linear/log normalization: equal counts use the same transfer and
  range in both visible panels, and zero activity is not painted. Use the observed
  keyboard plus **all available, successfully computed catalogue targets** for
  the current snapshot/activity to determine the maximum, even when hidden.
  Selecting a different target does not change the source's colors. Disabled or
  failed profiles never contribute guessed values to the range.
- Keep selected keyboard, All Time/day, scale and activity when selecting targets.
  Keep the existing manual Refresh, no polling, no focus-triggered fetch.
- No recording changes, historical backfills, migrations, application text
  capture, OS input-source activation or service reload during planning.

## 3. Profiles: five names are not five complete definitions

Each shipped target needs an exact, pinned definition: output mappings,
unshifted/Shift/Option/Shift+Option levels, dead-key semantics, geometry,
modifier/control placement, finger policy, shortcut behavior, provenance and
reference/version ID. A letter diagram alone is insufficient for All presses,
French accents, punctuation, shortcuts and modifier participation.

### Approved profile definitions

- QWERTY currently means **macOS US, ANSI**, not US International.
- AZERTY currently means **macOS French, ISO**, not French Numerical or the newer
  standardized Windows/French AZERTY variants.
- Preserve these two direct mappings unchanged. The approved composition extension
  may change target route coverage/counts; it does not change recorded data.

| Menu entry | Agreed reference |
| --- | --- |
| QWERTY | Existing macOS US ANSI, not US International |
| AZERTY | Existing macOS French ISO, not French Numerical or another standardized AZERTY |
| Colemak-DH | Current published macOS **ABC Extended-based**, **ISO standard** DH; documented Angle fingering; no DHk/Wide/Fat-Z |
| Bépo | Published macOS **1.1rc2**, compact **ISO**, **plain Bépo** shortcuts; no AZERTY/QWERTY shortcut fallback |
| ISRT | Original NotGate **2021-01-27** arrangement, compact **ANSI**, no Angle/Wide/Sym; conservative verified output levels only |

Approved ISRT historical arrangement anchor:

```text
Y C L M K   Z F U , ' [ ] \
I S R T G   P N E A O ;
Q V W D J   B H / . X
```

Corroborate and pin the complete base/Shift reference, including ordinary digits
and punctuation, before enabling ISRT. Unknown base arrangements are not accepted.
Explicitly unpublished Option levels may remain unsupported without disabling an
otherwise verified base profile. Never fill them from macOS US implicitly.

### Required definition and validation rules

- **Variant fidelity:** use exactly the approved variants above. Caps-Lock-as-
  Backspace, Colemak-DHk, alternative Bépo shortcut layers, and ISRT historical/
  ergonomic variants are not optional implementation-time substitutions.
- **ISRT provenance:** secondary implementations add Angle/Wide/Sym changes and
  show historical alternatives. The former primary link returned 404 during this
  planning pass. Corroboration is a technical validation task; if unresolved,
  disable ISRT with an explanation rather than choosing another arrangement.
- **Geometry and fingering:** comparing arrangements on their native staggered
  reference boards is different from placing them on the same 4×12 hardware.
  An ortholinear target would also need a specified number/symbol/control layer
  design, not an invented fit. Angle-mod fingering cannot be inferred using the
  existing standard physical-column assignments.
- **Fingers and controls:** standard touch typing except the documented DH Angle
  exception. Keep left-thumb Space, opposite-hand Shift/Option, existing Cmd/Ctrl
  side allocation and unplaced-side diagnostics, media/Fn conventions and normal
  Caps position. No other ergonomic or firmware remaps.
- **Missing levels:** no QWERTY/macOS US hybrid or guessed Option levels. Preserve
  explicit unsupported outcomes and explain incomplete output coverage.
- **Shortcuts:** retain the existing interpreted-action + Command/Control policy.
  Plain Bépo is selected, not a native AZERTY/QWERTY shortcut-position variant.
- **Composition (approved in round 3):** extend all five targets with verified
  recipes for é è ê ë à â ä î ï ô ö ù û ü ÿ ç œ æ and their uppercase forms where
  supported, in addition to existing literal-symbol recipes/direct outputs.
  Maximum: one dead-key activation plus one completing base-key action. Text
  only, never Cmd/Ctrl shortcuts. No source-history/application reconstruction.
  Unknown/failed recipes remain unmapped. Rank routes by counted base actions
  plus per-step modifier participation, then fewer steps, fewer modifiers and
  stable declared priority; do not infer shared modifier holds between steps.
  Existing QWERTY/AZERTY direct mappings stay fixed, but approved new recipes may
  change target coverage/totals. Arbitrary composition chains are out of scope.
- **Exact output matching:** composed outputs must match source codepoints
  exactly. Do not apply NFC/NFD equivalence, strip accents, fold case, expand
  œ/æ into oe/ae or replace quote characters. A visually equivalent decomposed
  output that does not match exactly is unsupported. Stored records are untouched.

No profile is considered finished until its approved mapping and provenance are
validated. No installer/input-source change is authorized by choosing a reference.

## 4. Implementation plan

### 4.1 Registry rather than positional arrays

Introduce a typed, declarative target registry with stable profile IDs. Each entry
describes its display label, exact variant, geometry, provenance/version and pure
projection profile. Source interpretation remains separately identified.

- Replace assumptions that `targetProfiles[i]` matches `results[i]` with lookup by
  profile ID. Reordering the menu must not change the meaning of cached results.
- Retain reusable decode/route/accounting functions. Extend profile metadata and
  factories only where approved profiles require it; do not put per-layout logic
  in the renderer or invent an external plugin system.
- Keep profile data static and local, with versioned source artifacts/checksums,
  any applicable licensing/attribution, reproducible conversion and independent
  known-output fixtures. No runtime network dependency for layouts.
- Report provenance per selected target; the current single global French/US
  provenance statement is no longer sufficient for a mixed-origin catalogue.

### 4.2 Selection, derived results and snapshot state

- Add one selected target ID to comparison state. Its default and persistence are
  AZERTY and browser-wide storage respectively, separate from existing
  scale/activity state. Date, activity, scale and manual Refresh preserve the ID;
  changing recording keyboards preserves it too. Keep dropdown focus and reset
  only obsolete target-key inspection on target change.
- Retain one aggregate source response per selected keyboard/day, already carrying
  All presses and Printing only variants. Target selection must not fetch source
  history again or download event sequences.
- Cache target computations by dataset snapshot/generation, activity and profile
  identity/version, not array index. A refresh invalidates derived results for
  that dataset. Existing generation guards continue to prevent stale snapshots.
- Compute/validate the available catalogue for the snapshot/activity, with results
  or errors keyed by profile ID. The stable normalization needs all valid target
  values, but only two panels render. Cache both activity variants as appropriate;
  avoid adding server-side target projection endpoints or source requests.
- Change selection atomically: never put one layout's label over another's heatmap,
  counts or diagnostics. Selection during fetch must use the latest chosen ID.
- If a saved target ID is removed or a profile is invalid, use the agreed explicit
  fallback/error behavior; never silently relabel another profile's result.

Startup fallback for an unknown/removed or known-but-disabled remembered target
is **silent**: AZERTY, then QWERTY, then the first verified available target in menu
order. Update the saved choice, if storage is writable. If no target is usable,
keep the observed panel and show an explicit no-target-available state.

A profile-specific computation failure after refresh is different: retain the
actively selected ID, show its error instead of a projection, and let the user
choose another valid target. Do not silently switch layouts under an active user.
Keep source data and other valid targets usable. A valid profile with low/zero
character coverage is not a failed profile and remains selectable. Source fetch/
contract failures retain the existing source-level error/retry behavior.

### 4.3 Two-column presentation and normalization

- Adapt current shared CSS-grid/subgrid sections to two equal columns, preserving
  header, heatmap, row/hand/finger section alignment and mobile stacking.
- Reuse the existing diagrams, original palette/blur, accessible keyboard data
  table, statistics meters and target diagnostics.
- Derive one normalization object from the observed panel plus all successfully
  computed, available targets for the current snapshot/activity, and pass it to
  both visible renderers. Label the range as catalogue-wide across **available**
  layouts, including hidden ones. Target selection must not rescale the source;
  changes to dataset/activity or available catalogue may legitimately change it.
- Profile-specific fingering/geometry caveats and missing-output coverage remain
  visible without requiring users to understand implementation details.

### 4.4 Likely code boundaries

| Area | Expected change |
| --- | --- |
| `src/common/src/projection/profiles.ts` and profile data | Registry, pinned target mappings, per-profile metadata |
| `src/common/src/projection/geometry.ts` | Reuse or explicitly extend approved geometry/fingering policies |
| Native probe/import tooling | Reproducible extraction/validation for selected definitions, development only |
| `src/client/src/state/projectionStore.ts` and `projection.ts` | Selected target, keyed derived results, snapshot-safe caching |
| `src/client/src/components/projection/LayoutComparison.tsx` | Dropdown, one target, correct selected metadata and shared scale |
| `src/client/src/components/projection/projection.css` | Two aligned columns and responsive stacking |
| Tests and documentation | Profile fixtures, selection/race/cache regressions, updated labels/limitations |

The current source API/database need not change merely to add target profiles.
Any proposed exception must be justified against an approved profile requirement.

### 4.5 Execution order

1. Inventory/pin approved profile artifacts, licenses and provenance. Validate
   complete ordinary base/Shift definitions, geometry/fingering and available
   higher levels; represent missing/unverified profiles as unavailable explicitly.
2. Add registry metadata and pure profile/recipe support. Implement the approved
   bounded French composition, exact-codepoint verification and counted-use route
   ranking, with independent fixtures and accounting regressions before UI wiring.
3. Replace positional result arrays with ID-keyed results/errors. Add selected
   target persistence, silent startup fallback and isolated per-profile failures;
   preserve source snapshot/race/refresh behavior and compute the stable scale.
4. Render the native selector and two aligned panels with selected-profile notes,
   availability explanations, shared available-catalogue legend and mobile stacking.
5. Update documentation and run build/typechecks/unit/API/state/browser checks.
   Report enabled versus disabled profiles and exact validation limitations.
   Do not mark an unverified profile complete or reload the user's service merely
   as part of planning.

## 5. Acceptance checks

1. Exactly one observed and one selected-target panel are visible when a target
   is usable, with five menu entries and an accessible keyboard-operable native
   select. Disabled entries have explanations; no-target/profile-error states
   never display guessed target data.
2. Every enabled target's approved letter, punctuation, modifier, control, shortcut and
   dead-key behavior has independent fixtures, with no undocumented fallback.
3. All target totals/distributions reconcile; unsupported outputs stay disclosed.
4. Source counts and colors do not change when only the selected target changes;
   the range includes all valid available targets, not just the visible pair.
5. Both visible panels use the identical normalization configuration. All presses,
   Printing only, day/All Time and linear/log continue to work for every target.
6. Target selection makes no extra historical-data request, preserves controls,
   and cannot show stale counts under a new title, including during refresh/error.
7. Desktop sections/individual statistic rows align; mobile remains readable and
   ordered observed-first. Inspecting keys cannot disrupt section alignment.
8. Existing QWERTY/AZERTY direct definitions remain unchanged; regression tests
   distinguish approved new composition/ranking effects on coverage/totals from
   accidental mapping changes. The original observed page and capture remain untouched.
9. Invalid saved IDs and profile validation failures follow agreed explicit rules.
10. Build, typechecks, unit/API/state tests and real-browser smoke checks pass.
11. New recipes cover only the agreed French set/uppercase and bounded one-dead-key
    sequences; direct outputs outside that set remain supported. Validate exact
    codepoints, text-only eligibility, unsupported paths, accounting and tie-breaks.
12. AZERTY default/browser-wide persistence, storage-denied fallback, invalid or
    disabled saved IDs, disabled catalogue entries, per-profile refresh failure,
    zero character coverage and no-available-target cases have explicit tests.

## 6. Closed decision register and interview history

| ID | Decision | Status |
| --- | --- | --- |
| D01 | Confirm exact two-panel, observed-fixed comparison and preserved behavior bundle | Confirmed: exactly two; observed left, selected target right; no target-vs-target/third-panel mode |
| D02 | Keep existing macOS US QWERTY / French AZERTY definitions | Confirmed direct definitions unchanged; approved composition/ranking extension may change coverage/totals |
| D03 | Target geometry policy: native/reference boards versus uniform geometry/4×12 | Confirmed: compact staggered reference boards, ISO/ANSI per approved variant |
| D04 | Exact Colemak variant and any Angle/Caps/other adaptations | Confirmed: current Colemak-DH ISO standard, documented Angle fingering, published macOS ABC Extended-based variant; no DHk/Wide/Fat-Z |
| D05 | Exact Bépo version, platform mapping and any Command variant | Confirmed: published macOS 1.1rc2, plain Bépo shortcut behavior |
| D06 | Exact ISRT reference/adaptation and source artifact | Confirmed: original 2021-01-27 NotGate arrangement on compact ANSI, no Angle/Wide/Sym; corroborate/pin before enabling |
| D07 | New profile symbol/Option levels when not published by the chosen reference | Confirmed: conservative verified original outputs only; missing ISRT levels stay unsupported, no macOS US hybrid |
| D08 | Standard versus variant-specific target fingering; thumb/modifier allocation | Confirmed: documented DH Angle exception; otherwise existing standard touch typing, left-thumb Space and opposite-hand Shift/Option; no new remaps |
| D09 | Native shortcut layers versus existing semantic shortcut policy | Confirmed: plain Bépo, existing semantic/side policy and control/media/Fn conventions retained |
| D10 | Keep existing limited dead-key recipes versus a specifically bounded extension | Confirmed: French letter set + uppercase, one dead key plus base maximum, all five targets, text only and verified only; counts may change through new routes |
| D11 | Initial target and menu labels/order | Confirmed: AZERTY default; order QWERTY, AZERTY, Colemak-DH, Bépo, ISRT; exact variant in panel |
| D12 | Target persistence and scope across reloads/devices | Confirmed: one browser-wide preference across reloads and recorded keyboards; storage failure falls back to memory |
| D13 | Normalization maximum: visible pair versus whole approved catalogue | Confirmed: observed + all valid available targets, including hidden ones; failed/disabled profiles excluded and legend explicit; stable across selection |
| D14 | Preserve/reset target and controls on keyboard/date/activity changes | Confirmed: preserve target/date/activity/scale as applicable; reset only obsolete target-key inspection; dropdown focus retained; observed-first mobile |
| D15 | Invalid saved ID/profile-unavailable behavior and release completeness | Confirmed: partial availability; disabled entries explained. Unknown/removed/disabled remembered ID silently falls back AZERTY → QWERTY → first available; none usable means observed + no-target state |
| D16 | Composition route ranking | Confirmed: fewest total counted uses, then fewer steps, fewer modifiers, stable declared priority; no cross-step hold inference |
| D17 | Unicode canonical-equivalence matching for composed outputs | Confirmed: exact codepoints only, no NFC equivalence, accent/case folding, ligature expansion or quote substitution |
| D18 | Pin the historical original ISRT arrangement | Confirmed: 2021-01-27 rows in section 3; complete base/Shift digits/punctuation require corroboration; unpublished Option may remain unsupported |
| D19 | Partial-catalogue normalization and known-unavailable target behavior | Confirmed: isolate failures, exclude failed values from range, keep active failed selection after refresh with error; valid zero-coverage targets remain selectable |

All 19 product decisions are closed. The five rounds below record the sequence
of answers; references to an upcoming round describe the historical interview,
not current unresolved work. Missing/corroborated profile data remains a named
technical validation task with an agreed disabled-profile outcome, not a hidden
product decision or permission to guess.

### Interview round 1 — recorded decisions

The user confirmed D01–D03 and selected **Colemak-DH**, **macOS Bépo 1.1rc2**,
**original ISRT**, and **catalogue-wide stable normalization**. Consequently the
menu should identify the chosen Colemak profile as Colemak-DH, not silently label
it generic Colemak. Further questions must resolve actual profile definitions,
not reopen the two-panel/geometry-family/normalization choices already answered.

### Interview round 2 — recorded decisions

- Colemak-DH: ISO standard, published macOS ABC Extended-based variant, with
  documented DH Angle fingering. No older DHk/Wide/Fat-Z/custom remaps.
- Bépo: plain macOS 1.1rc2, not an AZERTY/QWERTY shortcut variant.
- ISRT: original on compact ANSI, conservative verified original output levels;
  do not synthesize undocumented Option levels from macOS US.
- Existing thumb/modifier/control rules confirmed, except the explicit DH Angle
  fingering override.
- The user **does want broader character support**, rejecting the proposed
  “existing literal recipes only” limit. This is an explicit scope addition,
  but not yet permission for arbitrary composition, source-sequence inference,
  external layout installation, or changes to unrecorded application behavior.
  The next interview round must bound supported characters, sequence length,
  target applicability, shortcut exclusions and route selection before finalizing.

### Interview round 3 — recorded decisions

- New composed routes are bounded to **é è ê ë à â ä î ï ô ö ù û ü ÿ ç œ æ** and
  their uppercase forms where an approved target definition supports them.
  Verified direct outputs remain supported outside this set, and existing
  literal ^/backtick/tilde recipes remain available.
- Maximum **one dead key + one completing base key**; count required modifiers
  separately per step. No multi-dead-key chains or inferred modifier holds.
- Apply the same policy to **all five** targets, including QWERTY/AZERTY. The user
  explicitly accepts coverage/total changes from new recipes, not changes to
  their direct layout definitions or recorded data.
- Choose minimum total counted key uses; ties use fewer steps, fewer modifiers,
  then stable declared priority.
- Composition is text-only, verified against each selected target; no composed
  shortcuts, historical source dead-key reconstruction or application inference.

### Interview round 4 — recorded decisions

- Initial target **AZERTY**, even though QWERTY is first in the requested menu.
- Remember one target preference browser-wide across reloads and recording
  keyboards; do not add persistence for other controls or auto-open comparison.
  Browser storage failure falls back to memory.
- Confirmed the native dropdown above the panels, controls/source preservation,
  target-key inspection reset, dropdown focus retention and observed-first mobile.
- Removed/unknown remembered target IDs silently revert to AZERTY; no notice.
- Partial availability is acceptable: verified layouts may ship while an
  unverified layout remains disabled with an explanation. Missing explicitly
  unpublished ISRT Option levels are allowed; an uncertain base arrangement is
  not. A hybrid/guessed profile is not an acceptable substitute.
- Composition validation requires **exact output codepoints**. Canonical Unicode
  equivalence is not accepted, even if glyphs render identically. No normalization
  of stored/source strings to make an unverified recipe appear to match.
- Final audit must settle the known-but-disabled saved-ID case, range behavior
  with unavailable profiles, and the exact historical ISRT reference anchor.

### Interview round 5 — recorded decisions

- Pin the 2021-01-27 original ISRT arrangement shown in section 3. Corroborate
  ordinary base/Shift digits/punctuation before enabling. Unknown Option levels
  alone may remain unsupported; an uncertain ordinary base definition disables it.
- Known-but-disabled remembered targets use the same silent startup fallback:
  AZERTY → QWERTY → first verified available entry. Save the fallback when possible;
  show the observed panel plus a no-target state if no target is usable.
- Isolate per-profile failures. Only valid successful catalogue results contribute
  to the common maximum; describe the range as available-layout catalogue-wide.
  Low/zero character coverage is not a profile failure. After refresh, a currently
  selected target that fails keeps its name/error until the user selects another;
  do not silently change active comparison intent.

### Final consistency and scope audit

- Confirmed one explicit scope addition: bounded target-side French composition
  for all five profiles, not general source reconstruction or arbitrary dead-key
  chains. Existing direct mappings and captured data stay fixed.
- Resolved the two conflicts introduced by earlier answers: catalogue-wide range
  excludes unavailable profiles, and silent remembered-ID fallback applies at
  startup, not to an actively selected target failing after Refresh.
- Exact-codepoint validation deliberately may leave visually equivalent outputs
  unsupported. ABC Extended selection is not a promise of 100% French coverage.
- Partial availability is deliberate: all five names appear, but only verified
  mappings are selectable. The broken former ISRT primary URL is a provenance
  limitation, not authorization to copy a modified implementation silently.
- No remaining product decisions within this scope. The original planning task
  changed no application files, database contents or running services. The user
  subsequently authorized the implementation described in section 4.

## 7. Reference sources (artifacts still require pinning/validation)

- Colemak macOS: <https://colemak.com/Mac>
- Colemak-DH implementations/geometry: <https://colemakmods.github.io/mod-dh/keyboards.html>
- Bépo macOS, including release and shortcut variants: <https://bepo.fr/wiki/MacOS>
- ISRT secondary implementation/history:
  <https://github.com/DreymaR/BigBagKbdTrixPKL/blob/master/Layouts/ISRT/README.md>
- That ISRT document's primary reference, <https://notgate.github.io/layout/>,
  returned 404 during research; do not treat the secondary adaptation as an
  automatically approved canonical source.
