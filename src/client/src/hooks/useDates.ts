import { DateState } from "~/state/date.js";
import { useAppState } from "~/state/appState.js";

export default function useDates(): Pick<
  DateState,
  "dates" | "date" | "setDate"
> {
  const dates = useAppState((state) => state.dates);
  const date = useAppState((state) => state.date);
  const setDate = useAppState((state) => state.setDate);

  return {
    date,
    dates,
    setDate,
  };
}
