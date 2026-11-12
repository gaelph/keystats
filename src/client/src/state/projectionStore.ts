import { createStore } from "zustand/vanilla";
import type { ProjectionSource } from "keystats-common/dto/projection";
import { defaultTargetId, initialTarget, targetRegistry, type TargetId, type TargetEntry, type TargetResults } from "keystats-common/projection";
import { readTarget, saveTarget, type TargetStorage } from "./targetPreference.js";

export interface ProjectionDataset { keyboardId: number; date: string | null }
export type ProjectionRequest =
  | { status: "idle" }
  | { status: "loading"; key: string }
  | { status: "error"; key: string; message: string }
  | { status: "ready"; key: string; source: ProjectionSource; results: TargetResults;
      printingResults?: TargetResults; loadedAt: number };
type Ready = Extract<ProjectionRequest, { status: "ready" }>;
export const datasetKey = (dataset: ProjectionDataset) => JSON.stringify([dataset.keyboardId, dataset.date]);

// Injectable I/O and pure computation keep state/race tests independent of React.
export function createProjectionStore(
  fetchSource: (dataset: ProjectionDataset) => Promise<ProjectionSource>,
  compute: (source: ProjectionSource) => TargetResults,
  options: { storage?: TargetStorage; registry?: readonly TargetEntry[] } = {},
) {
  let generation = 0;
  const cache = new Map<string, Ready>();
  const inFlight = new Map<string, Promise<Ready>>();
  const registry = options.registry || targetRegistry;
  const remembered = readTarget(options.storage);
  let startup = true;
  return createStore<{
    view: "observed" | "comparison" | "trends";
    scale: "linear" | "log";
    activity: "all" | "printing";
    targetId: TargetId | null;
    request: ProjectionRequest;
    setView: (view: "observed" | "comparison" | "trends") => void;
    setScale: (scale: "linear" | "log") => void;
    setActivity: (activity: "all" | "printing") => void;
    setTarget: (id: string) => void;
    load: (dataset: ProjectionDataset, force?: boolean) => Promise<void>;
  }>((set, get) => {
    const accept = (ready: Ready) => {
      if (!startup) { set({ request: ready }); return; }
      startup = false;
      const catalogue = get().activity === "printing" ? ready.printingResults || ready.results : ready.results;
      const targetId = initialTarget(get().targetId, catalogue, registry);
      saveTarget(options.storage, targetId);
      set({ request: ready, targetId });
    };
    return {
      view: "observed", scale: "log", activity: "all", request: { status: "idle" },
      targetId: registry.find((entry) => entry.id === remembered && entry.status === "available")?.id || defaultTargetId,
      setView: (view) => set({ view }),
      setScale: (scale) => set({ scale }),
      setActivity: (activity) => set({ activity }),
      setTarget: (id) => {
        const entry = registry.find((entry) => entry.id === id);
        if (!entry || entry.status !== "available") return;
        const { request, activity } = get();
        const results = request.status === "ready" ? activity === "printing" ? request.printingResults : request.results : undefined;
        if (results && results[id]?.status !== "ready") return;
        startup = false; // A deliberate choice during fetch must not be replaced by startup fallback.
        saveTarget(options.storage, entry.id);
        set({ targetId: entry.id });
      },
      async load(dataset, force = false) {
        const key = datasetKey(dataset);
        const current = ++generation;
        if (!force && cache.has(key)) { accept(cache.get(key)!); return; }
        if (force) { cache.delete(key); inFlight.delete(key); }
        set({ request: { status: "loading", key } });
        let task = inFlight.get(key);
        if (!task) {
          task = Promise.resolve().then(() => fetchSource(dataset)).then((source): Ready => {
            if (source.keyboardId !== dataset.keyboardId || source.date !== dataset.date) throw new Error("Projection response does not match the selected dataset");
            return { status: "ready", key, source, results: compute(source),
              printingResults: source.printing ? compute({ ...source, ...source.printing }) : undefined, loadedAt: Date.now() };
          });
          inFlight.set(key, task);
        }
        try {
          const ready = await task;
          // A forced refresh can replace this dataset's promise; don't cache its
          // older response even when it arrives after the refreshed result.
          if (inFlight.get(key) === task) {
            cache.delete(key);
            cache.set(key, ready);
            if (cache.size > 4) cache.delete(cache.keys().next().value!);
          }
          if (current === generation) accept(ready);
        } catch (error) {
          if (current === generation) set({ request: { status: "error", key,
            message: error instanceof Error ? error.message : "Could not load projection" } });
        } finally {
          if (inFlight.get(key) === task) inFlight.delete(key);
        }
      },
    };
  });
}
