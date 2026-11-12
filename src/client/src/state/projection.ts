import { useStore } from "zustand";
import { computeCatalogue } from "keystats-common/projection";
import { getProjectionSource } from "~/lib/api.js";
import { createProjectionStore } from "./projectionStore.js";
import { browserTargetStorage } from "./targetPreference.js";

export const projectionStore = createProjectionStore(
  ({ keyboardId, date }) => getProjectionSource(keyboardId, date),
  computeCatalogue,
  { storage: browserTargetStorage() },
);
type ProjectionState = ReturnType<typeof projectionStore.getState>;
export function useProjectionStore<T>(selector: (state: ProjectionState) => T): T {
  return useStore(projectionStore, selector);
}
