import additional from "./profiles/additional-layouts.json";
import { createProfile, createNativeTarget, frenchProfile, profileProvenance } from "./profiles.js";
import { project } from "./project.js";
import type { ProjectionSource } from "../dto/projection.js";
import type { LayoutProfile, ProjectionResult } from "./types.js";

export type TargetId = "qwerty" | "azerty" | "colemak-dh" | "bepo" | "isrt";
export interface TargetMetadata {
  id: TargetId;
  label: string;
  reference: string;
  provenance: string;
  sourceUrl: string;
  notes: string;
}
export type TargetEntry = TargetMetadata & (
  { status: "available"; profile: LayoutProfile } | { status: "unavailable"; reason: string }
);
export type TargetOutcome =
  | { status: "ready"; result: ProjectionResult }
  | { status: "unavailable" | "error"; reason: string };
export type TargetResults = Record<string, TargetOutcome>;

function entry(metadata: TargetMetadata, build: () => LayoutProfile): TargetEntry {
  try {
    const profile = build();
    if (new Set(profile.keys.map((key) => key.id)).size !== profile.keys.length) throw new Error("Duplicate physical key");
    return { ...metadata, status: "available", profile };
  } catch (error) {
    return { ...metadata, status: "unavailable", reason: error instanceof Error ? error.message : "Profile validation failed" };
  }
}

export const targetRegistry: readonly TargetEntry[] = [
  entry({ id: "qwerty", label: "QWERTY", reference: "macOS US · ANSI", provenance: `${profileProvenance.os} · UCKeyTranslate`,
    sourceUrl: "https://support.apple.com/guide/mac-help/use-the-keyboard-viewer-mchlp1015/mac", notes: "Existing macOS US definition, not US International." }, () => createNativeTarget("us")),
  entry({ id: "azerty", label: "AZERTY", reference: "macOS French · ISO", provenance: `${profileProvenance.os} · UCKeyTranslate`,
    sourceUrl: "https://support.apple.com/guide/mac-help/use-the-keyboard-viewer-mchlp1015/mac", notes: "Existing macOS French definition, not French Numerical." }, () => createNativeTarget("french")),
  entry({ id: "colemak-dh", label: "Colemak-DH", reference: "macOS ABC Extended · ISO · Angle fingering",
    provenance: `ColemakMods/mod-dh d9398d57695089658841f3dc62827ae814aef8c4 · SHA-256 ${additional.colemak.sha256}`,
    sourceUrl: "https://github.com/ColemakMods/mod-dh/tree/d9398d57695089658841f3dc62827ae814aef8c4/macOS",
    notes: "Published ISO Extended mapping, with documented Angle fingering for Z/X/C/D. No Wide, DHk, Fat-Z or Caps remap." },
  () => createProfile("macos-colemak-dh-iso-extended-v1", "Colemak-DH · ISO Extended", additional.colemak.outputs, true, additional.colemak.recipes, true)),
  entry({ id: "bepo", label: "Bépo", reference: "macOS Bépo 1.1rc2 · ISO · plain shortcuts",
    provenance: `Official 1.1rc2 bundle, bepo.keylayout · SHA-256 ${additional.bepo.sha256}`,
    sourceUrl: "https://bepo.fr/wiki/MacOS", notes: "Plain Bépo, not an AZERTY/QWERTY Command variant. Curly and straight apostrophes remain distinct." },
  () => createProfile("macos-bepo-1.1rc2-iso-v1", "Bépo · ISO 1.1rc2", additional.bepo.outputs, true, additional.bepo.recipes)),
  entry({ id: "isrt", label: "ISRT", reference: "Original 2021-01-27 · ANSI · verified base/Shift only",
    provenance: `Original arrangement corroborated with DreymaR's history and Keyboard-Design ANSI data · SHA-256 ${additional.isrt.sha256}`,
    sourceUrl: "https://www.keyboard-design.com/letterlayout.html?layout=isrt.en.ansi",
    notes: "No Angle/Wide/Sym adaptations. Option levels are unpublished/unverified and remain unsupported; no QWERTY hybrid. Original author's former page is unavailable." },
  () => createProfile("isrt-2021-01-27-ansi-v1", "ISRT · original ANSI", additional.isrt.outputs, false)),
];

export const defaultTargetId: TargetId = "azerty";
export const targetProfiles = targetRegistry.flatMap((entry) => entry.status === "available" ? [entry.profile] : []);
// Compatibility export for existing pure-engine callers; UI uses registry IDs.
export const usProfile = targetProfiles.find((profile) => profile.id === "macos-us-ansi-v1");

// A bad target must not turn a valid recording snapshot into a source error.
export function computeCatalogue(source: ProjectionSource, registry: readonly TargetEntry[] = targetRegistry,
  compute: typeof project = project): TargetResults {
  return Object.fromEntries(registry.map((target) => {
    if (target.status === "unavailable") return [target.id, { status: "unavailable", reason: target.reason }];
    try { return [target.id, { status: "ready", result: compute(source, frenchProfile, target.profile) }]; }
    catch (error) { return [target.id, { status: "error", reason: error instanceof Error ? error.message : "Target projection failed" }]; }
  }));
}

export function successfulResults(results: TargetResults): ProjectionResult[] {
  return Object.values(results).flatMap((outcome) => outcome.status === "ready" ? [outcome.result] : []);
}

export function initialTarget(remembered: string | null, results: TargetResults,
  registry: readonly TargetEntry[] = targetRegistry): TargetId | null {
  const usable = (id: string) => registry.some((entry) => entry.id === id) && results[id]?.status === "ready";
  return [remembered, defaultTargetId, "qwerty", ...registry.map((entry) => entry.id)]
    .find((id): id is TargetId => !!id && usable(id)) || null;
}
