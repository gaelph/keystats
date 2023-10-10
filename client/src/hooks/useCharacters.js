import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer from "../store/reducer.js";

import { getCharacterCounts } from "../lib/api.js";

export default function useCharacters(keyboard) {
  const [state, dispatch] = useReducer(dataReducer, {
    loading: false,
    error: null,
    data: null,
  });

  const fetchData = useCallback(async () => {
    if (!keyboard) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const data = await getCharacterCounts(keyboard.id);
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [keyboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
