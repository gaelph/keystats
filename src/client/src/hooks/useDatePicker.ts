import { useAppState } from "~/state/appState.js";

export default function useDatePicker() {
  const date = useAppState((state) => state.datePicker.date);
  const incrementMonth = useAppState(
    (state) => state.datePicker.incrementMonth,
  );
  const decrementMonth = useAppState(
    (state) => state.datePicker.decrementMonth,
  );
  const opened = useAppState((state) => state.datePicker.opened);
  const open = useAppState((state) => state.datePicker.open);
  const close = useAppState((state) => state.datePicker.close);

  return {
    date,
    incrementMonth,
    decrementMonth,
    opened,
    open,
    close,
  };
}
