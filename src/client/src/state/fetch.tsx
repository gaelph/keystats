import { StateCreator } from "zustand";

export interface FetchState {
  pendingCount: number;
  errors: Error[];
  setLoading: (loading: boolean) => void;
  addError: (error: Error) => void;
  clearErrors: () => void;
}

export const fetchStore: StateCreator<FetchState, [], [], FetchState> = (
  set,
  get,
) => ({
  pendingCount: 0,
  errors: [],
  setLoading: (loading: boolean) => {
    get().clearErrors();
    let pendingCount = get().pendingCount;
    if (loading) {
      pendingCount++;
    } else {
      pendingCount--;
    }
    if (pendingCount < 0) {
      pendingCount = 0;
    }
    set(() => ({ pendingCount: pendingCount }));
  },
  addError: (error: Error) => {
    set((state) => ({
      errors: state.errors.concat([error]),
    }));
  },
  clearErrors: () => {
    set(() => ({
      errors: [],
    }));
  },
});
