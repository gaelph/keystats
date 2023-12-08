import { useEffect } from "react";
import { create } from "zustand";
import { DateState, dateStore } from "./date.js";
import { FetchState, fetchStore } from "./fetch.js";
import { KeyboardState, keyboardStore } from "./keyboard.js";
import { KeyboardDataState, keyboardDataStore } from "./keyboardData.js";
import { KeyboardsState, keyboardsStore } from "./keyboards.js";
import { UiState, uiStore } from "./ui.js";

export const useAppState = create<
  FetchState &
    KeyboardsState &
    KeyboardState &
    KeyboardDataState &
    DateState &
    UiState
>()((...a) => ({
  ...fetchStore(...a),
  ...keyboardsStore(...a),
  ...keyboardStore(...a),
  ...keyboardDataStore(...a),
  ...dateStore(...a),
  ...uiStore(...a),
}));

export function useStoreInit() {
  const keyboard = useAppState((state) => state.keyboard);
  const date = useAppState((state) => state.date);
  const fetchKeyboards = useAppState((state) => state.fetchKeyboards);
  const fetchDates = useAppState((state) => state.fetchDates);
  const fetchKeymaps = useAppState((state) => state.fetchKeymaps);
  const refresh = useAppState((state) => state.refresh);

  useEffect(() => {
    fetchKeyboards();
    fetchDates();
  }, []);

  useEffect(() => {
    fetchKeymaps();
  }, [keyboard]);

  useEffect(() => {
    refresh();
  }, [keyboard, date]);
}
