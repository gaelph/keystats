# Post-writing audit: keyboard layout workload projection

Date: 2026-11-02
Reviewed document: `docs/specifications/layout-projection.md`
Sequence: the specification was saved first, then reread and checked against
the implementation. This audit and stakeholder interview occur afterward.

Current verdict: **Specification ready for implementation planning; no unresolved
product decision identified in the final review.** Full layout-profile verification
and automated implementation tests remain mandatory gates, not work completed by
this documentation task. See the final audit below.

Initial verdict, before the interview: **Useful draft, but not implementation-ready.** The accounting model
and explicit limitations are sound starting points. Product meaning, geometry,
source provenance, and inclusion policies still require stakeholder decisions.
No implementation or live-service changes were made during this audit.

## Findings

### A01 — Blocker: “another layout” has two different physical meanings

A standard staggered AZERTY/QWERTY reference keyboard is not the user's 4x12 QMK
matrix. Moving character counts onto the existing matrix requires actual target
firmware mappings, including layers and duplicate positions. Merely selecting
an OS input layout does not define those mappings.

Resolve D01–D03 before agreeing UI, projection output, or geometry fixtures.

### A02 — Blocker: source decoding cannot be inferred from the UI labels

The code currently formats labels as Mac AZERTY, but that does not prove which
OS input source the user used. The firmware reports keycodes and modifiers,
not the final application output. Host remappers, IMEs, dead keys, and input
source switches can change the result after the captured event.

Resolve D04–D05, and additionally identify host transformations (D21). Decide
whether approximation is accepted, whether periods can be manually annotated,
and whether unknown history blocks the feature or carries a warning.

### A03 — High: historical keycode attribution can change retroactively

`src/service/repository/keymapRepo.ts` updates a keymap's `keycode` on conflict.
Records refer to that mutable keymap. An earlier firmware mapping may therefore
be irrecoverable from the present database. This is distinct from changing the
OS input source. A disclaimer is necessary unless provenance is independently
established; no algorithm can backfill information that was not retained.

Resolve D05. Do not promise identity with actual historical text or repair
historical records as part of this feature without separate authorization.

### A04 — High: existing layout tables are not authoritative profiles

A direct evaluation of the existing tables found:

- `azerty_mac.ts`: HID `0x1d` maps to `w`, but its Shift entry maps to `Z`.
  This is internally inconsistent for the intended letter pair.
- `qwerty.ts`: letter labels are uppercase and no exported Shift mapping exists.
  This is insufficient to decode a full output repertoire.

Therefore, reusing `formatKeyCode()` output as a reversible character model
would bake existing label issues into the new feature. Define and independently
test the selected variants, rather than using the current tables as an oracle.
Fixing unrelated existing label behavior is not implicitly authorized.

### A05 — High: character workload is not complete physical effort

Excluding standalone modifiers and shortcuts gives a clean character projection,
but it excludes a substantial category of real typing. Conversely, synthesizing
one Shift press per capital overcounts holds and cannot be described as actual
keypress load. Space, Enter/Tab, deletion, shortcuts, and target layer access all
need explicit inclusion policies.

Resolve D08–D14 and D17. UI wording must follow the agreed counting unit.

### A06 — High: unsupported accents can bias a comparison

Two layouts may cover different portions of the source output. A visually
lighter target might simply omit more output. Coverage, a common denominator,
and a visible unsupported-output list are essential; alternatively compare only
the intersection and expose the excluded portion. Do not silently transliterate.

Resolve D12 and D15, including a policy for very low or zero target coverage
(D24). Clarify whether source and target dead-key sequences are out of scope.

### A07 — High: existing heatmap colors are not comparable across panels

`Heatmap.tsx` applies a logarithmic transformation and recalculates minimum and
maximum for each matrix. Reusing it unchanged would undermine the proposed
shared-scale guarantee. Shape, kernel blur, scale function, and normalization
must be explicit when comparing a regular matrix to a reference keyboard.

Resolve D16. A projected source-layout baseline is different from the observed
custom-keyboard heatmap; decide which baseline the user wants (D22).

### A08 — Medium: UX and release scope can expand unintentionally

Arbitrary periods, multiple devices, a custom layout editor, projected finger
statistics, saved preferences, difference views, and exports are separable
features. The specification proposes defaults but has no stakeholder approval.
Ask for a concrete first-release example and acceptance dataset (D23).

Resolve D06–D07 and D16–D20 before estimating or implementing.

### A09 — Medium: API and performance proposal needs a boundary correction

If source decoding is client-side, the raw aggregate API cannot itself provide
layout-dependent eligible/mapped/unknown accounting. It should provide input
totals and lossless grouped actions; the projection engine computes the remaining
categories. “No new raw text logging” means no ordered text/event history; the
UI still necessarily derives and displays aggregate output frequencies.

Target changes should be local. Source changes should rerun decoding without
refetching the same raw groups. New filters must be applied consistently to all
panels. Performance gates need agreed reference conditions, not a guarantee that
ignores capture contention and browser rendering.

Resolve the product decisions first, then revise section 7 accordingly.

## Interview plan

1. Settle purpose, geometry, variants, source assumptions, and historical trust.
2. Use those answers to choose relevant questions about shortcuts, controls,
   modifiers, case, accents, duplicate routes, and target layers.
3. Settle comparison denominators, baseline, UI, ancillary statistics, filter
   scope, persistence, performance, and concrete acceptance examples.
4. Revise the specification and this audit with approved decisions. Repeat the
   review for any remaining contradiction; do not treat unanswered choices as
   agreement to defaults.

Additional decision IDs introduced by this audit:

- D21: Host remappers/IME transformations and the boundary of source decoding.
- D22: Projected standard-layout baseline versus observed physical-keyboard data.
- D23: Concrete expected-input/output examples and first-release acceptance.
- D24: Low/zero-coverage display or blocking policy.

## Interview round 1 outcome

User selected all-key physical workload on standard keyboards, with macOS French
as the source and macOS French + US QWERTY as initial targets. They confirmed no
relevant host remapping, OS input-source changes, or firmware character-mapping
changes. They accept a warning and best-effort projection for uncertain history.

A01/A02 are partially resolved. Standard-keyboard form factor is still open.
A03 remains a technical limitation, with warning-and-continue approved. A05 now
requires particular attention: all-key physical workload cannot honestly mean
exact counterfactual press counts without an agreed modifier/hold model. The
initial character-only counting rules are explicitly marked superseded pending
round 2. No unanswered policy is considered approved.

## Interview round 2 outcome

User selected recorded-event replay (no synthetic modifiers), shortcuts following
letter/symbol identity, compact Apple geometry, direct target routes only, an
unmapped-actions list, fewest-modifiers target routing, and merged recording
layers. Their opposite-hand preference applies only to synthetic modifiers, which
the selected replay model does not generate. This distinction requires a concrete
confirmation so it does not become a hidden contradiction.

Next boundary cases: exact compact key inventory; control actions requiring Fn;
missing left/right modifier keys; modifier-sensitive shortcut identity; Caps Lock;
unmapped dead-key actions; and fair coverage/normalization. These are product
choices, not defects to be silently resolved by the implementation.

## Interview round 3 outcome

The concrete Shift example changed the user's choice from recorded-event replay
to estimated target key participation. This resolves the original modifier-hold
ambiguity only if the UI clearly counts modifier participation per base action,
not physical press/release events. It requires follow-up on three earlier answers
that were framed in replay mode: Fn annotation, retaining shortcut modifiers,
and the meaning of an all-recorded-actions denominator.

Other decisions: simplified compact Apple geometry; unavailable modifier sides
summarized by family; Shift/Option-resolved shortcut symbol identity; Caps Lock
assumed off; source dead keys approximated as their literal glyphs. These are
recorded in the specification, with explicit supersession rather than silently
mixing incompatible counting models.

## Interview round 4 outcome

Estimated per-action participation is confirmed. Fn is counted, not just
annotated. Source text-producing Shift/Option are replaced with target-route
requirements even for Command/Control shortcuts; Command/Control are retained.
Generated Shift/Option use opposite target hands. Space is explicitly left-thumb.
Assignable modifiers appear in the heatmap and all families have non-additive
roll-up summaries. Unavailable side-specific uses remain separately visible.

The user replaced percentage-based key intensity with **counts only**, removing
the earlier denominator contradiction. Source-action coverage remains distinct
from generated key-use counts. Remaining questions concern first-release UI,
filtering, refresh, summary scope, color scale, and acceptance examples.

## Interview round 5 outcome and final edge-case audit

User approved a separate two-panel comparison tab, current All Time/day filters,
one selected keyboard, no additional finger/hand/row statistics, a shared
linear/log toggle, media/system-primary function row, and manual refresh only.

A focused read-only query of Technik records found custom actions that affect
coverage: `7e50` (6,631), `7e52` (4,825), `7e4f` (2,346), and `7e51` (683).
Current code labels these backtick, right single quotation mark, circumflex,
and tilde respectively, but display labels do not establish their firmware
semantics. Other custom controls are present in small counts. These aliases
need user confirmation or must remain unmapped; silently trusting the labels
would contradict A04.

One final source/target boundary requires agreement: the user approved treating
source dead keys as literal glyphs, but the target French key for a glyph such
as circumflex is also a dead key. Counting that key alone is an explicit
dead-key-glyph approximation, not a direct completed-character route. Clarify
whether this exception applies to the target as well. The exact simplified
function-row action table also needs confirmation rather than an implicit
choice between historical Apple keyboard models.

## Interview rounds 6–7 outcome

Custom literal aliases are confirmed by the user; other custom actions remain
unmapped. The user explicitly introduced target dead-key-plus-Space recipes,
limited them to circumflex/backtick/tilde, and confirmed that generated commit
Spaces and per-step modifiers contribute estimated workload.

The final questions resolved two possible overcounting/semantic errors:

- Ordinary source dead-key events remain unresolved, rather than being treated
  as completed literal glyphs. This avoids guessing whether a recorded Space
  committed a dead key or was independent input.
- A text-entry commit recipe is never substituted for a shortcut. A shortcut
  requiring such a multi-step route stays unmapped.

The function-row reference and remaining release defaults were explicitly
accepted. Forty-seven questions were answered across seven rounds. The user
changed several preliminary choices; the final specification must use the last
approved decision rather than the initial draft or superseded interview notes.

## Final consistency audit

The consolidated specification was saved, reread and checked after the interview.
The original proposal and decision chronology were moved to
`layout-projection-interview-notes.md` and explicitly marked superseded. The
canonical specification contains only the final product rules, with historical
alternatives mentioned solely to identify their supersession.

| Finding | Final disposition |
| --- | --- |
| A01: Meaning and geometry | Settled: estimated participation on simplified compact French ISO / US ANSI references, not the recording matrix. |
| A02: Source decoding | Settled: declared stable macOS French, no relevant host remapping, persistent modes off. Source labels are not an oracle. |
| A03: Mutable history | Limitation accepted: warn and continue; no historical repair or exact-text claim. |
| A04: Incomplete/incorrect existing tables | Independent validated profiles and fixtures required during implementation; current tables cannot validate themselves. Four custom glyph aliases explicitly confirmed by user. |
| A05: Physical effort versus participation | Settled: target key participation per action/recipe step, no addition of standalone source modifiers; no actual-press/hold claim. |
| A06: Coverage/composition | Settled: counts-only heatmaps, visible source-action coverage, no transliteration, only three explicit literal-glyph commit recipes, no recipe substitution for shortcuts. |
| A07: Non-comparable colors | Settled: shared maximum, explicit linear/log formulas, equal counts get equal intensity, no per-panel renormalization. |
| A08: Scope expansion | Settled: two fixed panels, one device, existing day/All Time filters, manual refresh, no additional projected ergonomics or editing/export features. |
| A09: API/accounting boundary | Corrected: lossless raw aggregates from the API; decode, routes and projected accounting in the pure engine; lazy single-dataset reuse and request deduplication. |

Specific contradiction checks:

- Recorded-event replay is not a second mode and is not mixed into participation.
- Source modifier events are contextual input, not additional projected uses.
- Fn contributes participation; it is not merely an annotation.
- Command/Control are retained while source printable Shift/Option are replaced
  by target requirements. Named non-text modifier chords remain explicit.
- Space is left-thumb; generated Shift/Option use the opposite target hand.
- Physical modifier keys and modifier-family summaries are not counted twice.
- Literal-glyph recipes can add Space and change totals; per-step modifiers do
  not leak onto the commit Space.
- Only confirmed custom aliases establish literal dead-key glyph intent;
  ordinary source dead keys remain unresolved.
- All source base actions reconcile into supported/unmapped counts; generated
  totals reconcile separately into physical uses and unplaced modifier uses.
- Counts-only intensity does not contradict coverage percentages: they are
  different, explicitly named measures.
- The selected simplified media-primary function row, one-step controls and Fn
  routes are stated explicitly rather than inherited from an unknown Apple model.
- Older declared assumptions remain warnings; missing data is not fabricated.

Remaining implementation gates, not unanswered stakeholder questions:

1. Obtain and independently verify complete macOS French/US output profiles,
   reference geometry and semantic action mappings.
2. Implement the aggregate DTO/query and deterministic source/route engine.
3. Verify the confirmed examples, accounting identities, side allocation,
   three recipe exceptions, coverage and shared scale with automated fixtures.
4. Verify lazy loading, refresh, stale-response handling, accessibility and the
   agreed idle-service aggregate performance target.

No feature code, build, migration, capture change or service reload was performed
for this specification task. No implementation or deployment authorization is
implied by completion of this audit.
