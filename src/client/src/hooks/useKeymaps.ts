import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer, { State } from "../store/reducer.js";

import { getKeyboardKeymaps, Keyboard } from "../lib/api.js";
type Data = Awaited<ReturnType<typeof getKeyboardKeymaps>>;

export default function useData(
  keyboard: Keyboard | null,
): [Data | null, boolean, Error | null, () => Promise<void>] {
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
    if (!keyboard) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const data = await getKeyboardKeymaps(keyboard.id);
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [keyboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
