import { listKeyboards } from "~/lib/api.js";
import { StateCreator } from "zustand";
import { FetchState } from "./fetch.js";

export interface KeyboardsState {
  keyboards: Awaited<ReturnType<typeof listKeyboards>>;
  fetchKeyboards: () => Promise<void>;
}

export const keyboardsStore: StateCreator<
  KeyboardsState & FetchState,
  [],
  [],
  KeyboardsState
> = (set, get) => ({
  keyboards: [],
  async fetchKeyboards() {
    get().setLoading(true);
    try {
      const data = await listKeyboards();
      set(() => ({
        keyboards: data,
      }));
    } catch (error) {
      if (error instanceof Error) {
        get().addError(error);
      }
    } finally {
      get().setLoading(false);
    }
  },
});
