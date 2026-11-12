import { create } from "zustand";

export const useTrendsRefresh = create<{ version: number; refresh: () => void }>((set) => ({
  version: 0, refresh: () => set((state) => ({ version: state.version + 1 })),
}));
