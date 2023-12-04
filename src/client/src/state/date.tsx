import dayjs from "dayjs";
import { KeyboardState } from "./keyboard.js";
import { StateCreator } from "zustand";
import { FetchState } from "./fetch.js";
import { getDates } from "~/lib/api.js";

export interface DateState {
  date: dayjs.Dayjs | null;
  dates: dayjs.Dayjs[];
  setDate: (date: dayjs.Dayjs | null) => void;
  setDates: (dates: dayjs.Dayjs[]) => void;
  fetchDates: () => Promise<void>;
}

export const dateStore: StateCreator<
  DateState & FetchState & KeyboardState,
  [],
  [],
  DateState
> = (set, get) => ({
  date: null,
  dates: [],
  setDate: (date: dayjs.Dayjs | null) => {
    set(() => ({ date }));
  },
  setDates: (dates: dayjs.Dayjs[]) => {
    set(() => ({ dates }));
  },
  async fetchDates(): Promise<void> {
    const { setLoading, addError, keyboard } = get();
    if (keyboard === null) return;

    try {
      setLoading(true);
      const data = await getDates(keyboard.id);
      set(() => ({ dates: data.map((date) => dayjs(date)) }));
    } catch (error) {
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  },
});
