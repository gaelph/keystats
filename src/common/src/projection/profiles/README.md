# Validated layout profiles

`generated-layouts.json` is captured from macOS's installed French and US Unicode
keyboard layout definitions using `UCKeyTranslate`. It is static runtime data;
the application does not invoke Carbon or change the user's input source.

Regenerate on macOS:

```sh
swift scripts/generate-layout-profiles.swift > src/common/src/projection/profiles/generated-layouts.json
```

The probe tests unshifted, Shift, Option and Shift+Option output, resetting dead
state per source combination, and checks dead-key output by committing with Space.
ISO USB grave/extra-key virtual positions are explicitly swapped at the HID/TIS
boundary. Tests independently assert known French/US letters, punctuation, dead
keys and modifier behavior; regeneration is not an instruction to auto-approve
changes in the resulting mappings.

Geometry, media-primary function-row semantics and the user-confirmed custom
glyph aliases are explicit reference policies, not generated from TIS labels.

Standard controls, modifier codes and QK_MODS ranges are independently checked
against QMK's `quantum/keycodes.h` (keycodes version 0.0.9). The legacy embedded
modifier adapter has explicit fixtures for left/right masks and already-reported
bits. Unknown quantum/user actions are not guessed.

## Selectable catalogue and composition data

`sources.json` pins the exact downloaded artifacts, SHA-256 digests, attribution
and applicable data licenses. `additional-layouts.json` contains extracted output
facts and bounded recipe tables, not vendor executables or a runtime XML parser.

- **Colemak-DH:** published macOS ISO **ABC Extended** definition at commit
  `d9398d57695089658841f3dc62827ae814aef8c4` (CC0). Geometry applies the documented
  Angle fingering: ISO extra Z = left pinkie, physical QWERTY Z/X/C = left ring /
  middle / index. No DHk/Wide/Fat-Z or Caps remap.
- **Bépo:** plain `bepo.keylayout` in the official **1.1rc2** bundle, ISO;
  not an AZERTY/QWERTY Command variant. Bépo mapping data is attributed to the
  Bépo community/Ergodis/bepo.fr under **CC BY-SA 3.0** (see the manifest's license
  URI). Extracted/adapted Bépo output/recipe data retains that license; application
  code has its separate project license. No endorsement is implied.
- **ISRT:** original 2021-01-27 ANSI arrangement, corroborated against the pinned
  history and the independently published Keyboard-Design base/Shift facts.
  The importer checks the approved rows and digit row before extracting factual
  outputs. No website software, metrics, prose or artwork is redistributed.
  Unpublished Option levels are **unsupported**, not synthesized from US.

Download the exact URLs in `sources.json` into a private temporary directory.
For Bépo, inspect/extract the disk image **read-only**, without installing the
bundle or activating an input source, and detach it after extraction. Then run:

```sh
python3 scripts/import-layout-profiles.py \
  --colemak /path/to/colemak-dh-iso-extended.keylayout \
  --bepo '/path/to/bepo 1.1.bundle/Contents/Resources/bepo.keylayout' \
  --isrt /path/to/isrt.en.ansi.json \
  --output src/common/src/projection/profiles/additional-layouts.json
swift scripts/generate-layout-profiles.swift --recipes-only > src/common/src/projection/profiles/native-compositions.json
```

The Python importer rejects changed checksums, ambiguous modifier maps and
unsupported state constructs. It follows the chosen XML map set/action states,
with Caps off, for unmodified/Shift/Option/Shift+Option outputs. XML 1.1 nonprinting
control references are ignored; controls use the existing explicitly declared
reference policy, not an invented vendor shortcut layer.

French-letter recipes are limited to the approved character set and exactly one
dead-key activation plus one completion, with per-step modifiers. Native recipes
are independently probed through `UCKeyTranslate`; imported recipes follow the
pinned vendor state tables. No NFC/NFD normalization is performed. An exact output
and completed state are required; unsupported characters remain unmapped.
Ordinary source dead-key composition remains unreconstructable.

Profile construction validates recipe bounds/keys and isolates invalid target
definitions as unavailable registry entries. Tests separately assert known rows,
ISO positions, fingering, punctuation, modifier behavior, route cost/accounting,
uppercase recipes and rejection of canonically equivalent output strings.
