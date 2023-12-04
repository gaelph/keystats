import { useAppState } from "~/state/appState.js";

export default function useFetchStatus(): {
  loading: boolean;
  errors: Error[];
  refresh: () => Promise<void>;
} {
  const loading = useAppState((state) => state.pendingCount !== 0);
  const errors = useAppState((state) => state.errors);
  const refresh = useAppState((state) => state.refresh);

  return { loading, errors, refresh };
}
