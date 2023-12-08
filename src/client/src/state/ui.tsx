import dayjs, { Dayjs } from "dayjs";
import { StateCreator } from "zustand";
import { produce } from "immer";

export interface UiState {
  keyboardPicker: {
    opened: boolean;
    open: () => void;
    close: () => void;
  };
  datePicker: {
    opened: boolean;
    date: Dayjs;
    open: () => void;
    close: () => void;
    incrementMonth: () => void;
    decrementMonth: () => void;
  };
}

export const uiStore: StateCreator<UiState, [], [], UiState> = (set, get) => ({
  keyboardPicker: {
    opened: false,
    open: () =>
      set(
        produce<UiState>((state) => {
          state.keyboardPicker.opened = true;
        }),
      ),
    close: () =>
      set(
        produce<UiState>((state) => {
          state.keyboardPicker.opened = false;
        }),
      ),
  },
  datePicker: {
    opened: false,
    // we set the initial date to the middle of the cusrent month
    // to avoid skipping february
    date: dayjs().startOf("month").add(15, "day"),
    open: () =>
      set(
        produce<UiState>((state) => {
          state.datePicker.opened = true;
        }),
      ),
    close: () =>
      set(
        produce<UiState>((state) => {
          state.datePicker.opened = false;
        }),
      ),
    incrementMonth: () => {
      const date = get().datePicker.date;
      const candidate = date.add(1, "month");

      if (candidate.isSameOrBefore(dayjs(), "month")) {
        set(
          produce<UiState>((state) => {
            state.datePicker.date = candidate;
          }),
        );
      }
    },
    decrementMonth: () => {
      const date = get().datePicker.date;
      const candidate = date.subtract(1, "month");

      if (candidate.isSameOrBefore(dayjs(), "month")) {
        set(
          produce<UiState>((state) => {
            state.datePicker.date = candidate;
          }),
        );
      }
    },
  },
});
