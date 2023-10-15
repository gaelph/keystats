import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer from "../store/reducer.js";

import { getTotalCounts } from "../lib/api.js";

export default function useCounts(keyboard, date) {
  const [state, dispatch] = useReducer(dataReducer, {
    loading: false,
    error: null,
    data: null,
  });

  const fetchData = useCallback(async () => {
    if (!keyboard) return;
    dispatch(setLoading(true));
    try {
      const filters = {};
      if (date) {
        filters.date = date.format("YYYY-MM-DD");
      }

      const data = await getTotalCounts(keyboard.id, filters);
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [keyboard, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
