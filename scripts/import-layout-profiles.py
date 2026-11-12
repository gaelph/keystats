#!/usr/bin/env python3
"""Development-only, bounded .keylayout importer. Never installs input sources.

The two approved XML artifacts use exact-state actions (not state ranges). Reject
unsupported constructs rather than approximating them. Output is static runtime
data, not an XML interpreter shipped to the browser.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

VIRTUAL_KEYS = dict(zip(range(4, 30), [0, 11, 8, 2, 14, 3, 5, 4, 34, 38, 40, 37, 46,
                                    45, 31, 35, 12, 15, 1, 17, 32, 9, 13, 7, 16, 6]))
VIRTUAL_KEYS.update(dict(zip(range(30, 40), [18, 19, 20, 21, 23, 22, 26, 28, 25, 29])))
VIRTUAL_KEYS.update({44: 49, 45: 27, 46: 24, 47: 33, 48: 30, 49: 42,
                     51: 41, 52: 39, 53: 10, 54: 43, 55: 47, 56: 44, 100: 50})
FRENCH = "éèêëàâäîïôöùûüÿçœæ"
ALLOWED = set(FRENCH + FRENCH.upper())


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


class Keylayout:
    def __init__(self, path, map_set):
        text = Path(path).read_text(encoding="utf-8")
        # XML 1.1 control outputs aren't accepted by Python's XML 1.0 parser.
        # They are nonprinting and controls are modeled separately by policy.
        text = re.sub(r"&#x([0-9a-fA-F]+);", lambda m: m[0] if int(m[1], 16) >= 32
                      or int(m[1], 16) in (9, 10, 13) else "", text)
        self.root = ET.fromstring(text)
        for when in self.root.iter("when"):
            if set(when.attrib) not in ({"state", "output"}, {"state", "next"}):
                raise ValueError(f"Unsupported state construct: {when.attrib}")
        self.actions = {a.get("id"): {w.get("state"): w.attrib for w in a}
                        for a in self.root.findall("actions/action")}
        self.terminators = {w.get("state"): w.get("output", "")
                            for w in self.root.findall("terminators/when")}
        sets = {s.get("id"): s for s in self.root.findall("keyMapSet")}

        def keys(set_id, index):
            mapping = sets[set_id].find(f"keyMap[@index='{index}']")
            if mapping is None:
                raise ValueError(f"Missing map {set_id}/{index}")
            inherited = keys(mapping.get("baseMapSet"), mapping.get("baseIndex")) if mapping.get("baseMapSet") else {}
            return {**inherited, **{int(key.get("code")): key.attrib for key in mapping}}

        def map_index(bits):
            active = ({"shift"} if bits & 2 else set()) | ({"option"} if bits & 4 else set())
            found = set()
            names = {"anyShift": "shift", "anyOption": "option", "anyControl": "control"}
            for select in self.root.findall("modifierMap/keyMapSelect"):
                for modifier in select:
                    tokens = modifier.get("keys", "").split()
                    required = {names.get(t, t) for t in tokens if not t.endswith("?")}
                    permitted = {names.get(t.rstrip("?"), t.rstrip("?")) for t in tokens}
                    if required <= active <= permitted:
                        found.add(select.get("mapIndex"))
            if len(found) != 1:
                raise ValueError(f"Ambiguous modifier map {bits}: {found}")
            return next(iter(found))

        self.maps = {bits: keys(map_set, map_index(bits)) for bits in (0, 2, 4, 6)}

    def translate(self, usage, modifiers, state="none"):
        key = self.maps[modifiers][VIRTUAL_KEYS[usage]]
        if "action" in key:
            action = self.actions[key["action"]]
            when = action.get(state)
            if when is not None:
                return when.get("output", ""), when.get("next", "none")
            prefix = self.terminators.get(state, "") if state != "none" else ""
            initial = action.get("none")
            if initial is None:
                raise ValueError(f"Missing initial action: {key}")
            return prefix + initial.get("output", ""), initial.get("next", "none")
        return (self.terminators.get(state, "") if state != "none" else "") + key.get("output", ""), "none"

    def profile(self):
        outputs, dead_keys, recipes = [], [], []
        for usage in sorted(VIRTUAL_KEYS):
            for modifiers in (0, 2, 4, 6):
                glyph, state = self.translate(usage, modifiers)
                dead = state != "none"
                verified = False
                if dead:
                    if not glyph:
                        dead_keys.append((usage, modifiers))
                    glyph, state = self.translate(44, 0, state)
                    followup, _ = self.translate(44, 0, state)
                    verified = followup == self.translate(44, 0)[0]
                if glyph:
                    outputs.append(dict(usage=usage, modifiers=modifiers, glyph=glyph, dead=dead, commitVerified=verified))
        for first, modifiers in dead_keys:
            for second in sorted(VIRTUAL_KEYS):
                for second_modifiers in (0, 2, 4, 6):
                    prefix, state = self.translate(first, modifiers)
                    glyph, state = self.translate(second, second_modifiers, state)
                    if prefix or glyph not in ALLOWED or state != "none":
                        continue
                    recipes.append(dict(glyph=glyph, steps=[dict(usage=first, modifiers=modifiers),
                                                           dict(usage=second, modifiers=second_modifiers)]))
        return dict(name=self.root.get("name"), sha256=None, outputs=outputs, recipes=recipes)


def isrt_profile(path):
    data = json.loads(Path(path).read_text())
    keys = {key["id"]: key for key in data["keys"]}
    # Independently approved 2021-01-27 arrangement, not an Angle/Wide adaptation.
    for ids, row in [(range(15, 28), "yclmkzfu,'[]\\"), (range(29, 40), "isrtgpneao;"),
                     (range(42, 52), "qvwdjbh/.x")]:
        if "".join(chr(keys[i]["primary"]) for i in ids) != row:
            raise ValueError("ISRT reference is not the approved original arrangement")
    if "".join(chr(keys[i]["primary"]) for i in range(1, 11)) != "1234567890":
        raise ValueError("Unverified ISRT digit row")
    positions = {0: 53, **dict(zip(range(1, 13), [*range(30, 40), 45, 46])),
                 **dict(zip(range(15, 28), [20, 26, 8, 21, 23, 28, 24, 12, 18, 19, 47, 48, 49])),
                 **dict(zip(range(29, 40), [4, 22, 7, 9, 10, 11, 13, 14, 15, 51, 52])),
                 **dict(zip(range(42, 52), [29, 27, 6, 25, 5, 17, 16, 54, 55, 56])), 56: 44}
    outputs = []
    for index, usage in positions.items():
        for field, modifiers in [("primary", 0), ("shift", 2)]:
            value = keys[index].get(field, -1)
            if value >= 32:
                outputs.append(dict(usage=usage, modifiers=modifiers, glyph=chr(value), dead=False, commitVerified=False))
    return dict(name="Original ISRT 2021-01-27, ANSI", sha256=digest(path), outputs=outputs, recipes=[])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--colemak", required=True)
    parser.add_argument("--bepo", required=True)
    parser.add_argument("--isrt", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    manifest = json.loads((Path(__file__).resolve().parents[1] / "src/common/src/projection/profiles/sources.json").read_text())
    for name, path in [("colemak", args.colemak), ("bepo", args.bepo), ("isrt", args.isrt)]:
        if digest(path) != manifest[name]["sha256"]:
            raise ValueError(f"Artifact checksum changed for {name}; validate and update provenance explicitly")
    result = {}
    for name, path, map_set in [("colemak", args.colemak, "16c"), ("bepo", args.bepo, "ISO")]:
        result[name] = Keylayout(path, map_set).profile()
        result[name]["sha256"] = digest(path)
    result["isrt"] = isrt_profile(args.isrt)
    Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({name: dict(outputs=len(profile["outputs"]), recipes=len(profile["recipes"]), sha256=profile["sha256"])
                      for name, profile in result.items()}, indent=2))


if __name__ == "__main__":
    main()
