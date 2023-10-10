import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer from "../store/reducer.js";

import { listKeyboards } from "../lib/api.js";

export default function useData() {
  const [state, dispatch] = useReducer(dataReducer, {
    loading: false,
    error: null,
    data: null,
  });

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await listKeyboards();
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
