import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer, { State } from "../store/reducer.js";

import { listKeyboards } from "../lib/api.js";

type Data = Awaited<ReturnType<typeof listKeyboards>>;

export default function useData(): [
  Data | null,
  boolean,
  Error | null,
  () => Promise<void>,
] {
  const [state, dispatch] = useReducer<typeof dataReducer<Data>, State<Data>>(
    dataReducer,
    {
      loading: false,
      error: null,
      data: null,
    },
    (state) => state,
  );

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await listKeyboards();
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
