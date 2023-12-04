import { useAppState } from "~/state/appState.js";
import { KeyboardDataState } from "~/state/keyboardData.js";

export default function useCounts(): Pick<
  KeyboardDataState,
  "counts" | "handAndFingerUsage"
> {
  const counts = useAppState((state) => state.counts);
  const handAndFingerUsage = useAppState((state) => state.handAndFingerUsage);

  return {
    counts,
    handAndFingerUsage,
  };
}
