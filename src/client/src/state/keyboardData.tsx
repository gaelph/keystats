import { FilterQuery } from "keystats-common/dto/keyboard";
import { StateCreator } from "zustand";
import {
  getCharacterCounts,
  getHandAndFingerUsage,
  getKeyboardKeymaps,
  getTotalCounts,
} from "~/lib/api.js";
import { DateState } from "./date.js";
import { FetchState } from "./fetch.js";
import { KeyboardState } from "./keyboard.js";

type Keymaps = Awaited<ReturnType<typeof getKeyboardKeymaps>>;
type Characters = Awaited<ReturnType<typeof getCharacterCounts>>;
type Counts = Awaited<ReturnType<typeof getTotalCounts>>;
type HandAndFingerUsage = Awaited<ReturnType<typeof getHandAndFingerUsage>>;

export interface KeyboardDataState {
  keymaps: Keymaps;
  characters: Characters;
  counts: Counts;
  handAndFingerUsage: HandAndFingerUsage;
  fetchKeymaps: () => Promise<void>;
  fetchCaracters: () => Promise<void>;
  fetchCounts: () => Promise<void>;
  fetchHandAndFingerUsage: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const keyboardDataStore: StateCreator<
  KeyboardDataState & FetchState & KeyboardState & DateState,
  [],
  [],
  KeyboardDataState
> = (set, get) => ({
  keymaps: [],
  characters: { records: [], totalCharacters: 0 },
  counts: {
    keymapUsage: [],
    layerUsage: {},
    rowUsage: {},
    handUsage: {
      0: 0,
      1: 0,
    },
    fingerUsage: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    },
    totalKeypresses: 0,
  },
  handAndFingerUsage: {
    handRepetitions: [[], []],
    fingerRepetitions: [],
  },
  fetchKeymaps: async () => {
    const { setLoading, addError, keyboard } = get();
    if (keyboard === null) return;

    try {
      setLoading(true);
      const data = await getKeyboardKeymaps(keyboard.id);
      set(() => ({ keymaps: data }));
    } catch (error) {
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  },
  fetchCaracters: async () => {
    const { setLoading, addError, keyboard, date } = get();
    if (keyboard === null) return;

    const filters: FilterQuery = {};
    if (date) {
      filters.date = date;
    }
    try {
      setLoading(true);
      const data = await getCharacterCounts(keyboard.id, filters);
      set(() => ({ characters: data }));
    } catch (error) {
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  },
  fetchCounts: async () => {
    const { setLoading, addError, keyboard, date } = get();
    if (keyboard === null) return;

    const filters: FilterQuery = {};
    if (date) {
      filters.date = date;
    }
    try {
      setLoading(true);
      const data = await getTotalCounts(keyboard.id, filters);
      set(() => ({ counts: data }));
    } catch (error) {
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  },
  fetchHandAndFingerUsage: async () => {
    const { setLoading, addError, keyboard, date } = get();
    if (keyboard === null) return;

    const filters: FilterQuery = {};
    if (date) {
      filters.date = date;
    }
    try {
      setLoading(true);
      const data = await getHandAndFingerUsage(keyboard.id, filters);
      set(() => ({ handAndFingerUsage: data }));
    } catch (error) {
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  },
  refresh: async () => {
    const { fetchCaracters, fetchCounts, fetchDates, fetchHandAndFingerUsage } =
      get();
    fetchCaracters();
    fetchCounts();
    fetchHandAndFingerUsage();
    fetchDates();
  },
});
