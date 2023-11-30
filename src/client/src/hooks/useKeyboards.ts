import { useReducer, useCallback, useEffect, useState } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer, { State } from "../store/reducer.js";

import { listKeyboards } from "../lib/api.js";
import { useFetchActions } from "~/state/fetch.js";

type Data = Awaited<ReturnType<typeof listKeyboards>>;

export default function useData(): [Data | null, () => Promise<void>] {
  const [state, setState] = useState<Data>([]);
  const { setLoading, addError } = useFetchActions();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listKeyboards();
      setState(data);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state, fetchData];
}
