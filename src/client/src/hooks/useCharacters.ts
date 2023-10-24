import dayjs from "dayjs";
import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer, { State } from "../store/reducer.js";

import { getCharacterCounts, Keyboard } from "../lib/api.js";
import { FilterQuery } from "keystats-common/dto/keyboard";

type Data = Awaited<ReturnType<typeof getCharacterCounts>>;

export default function useCharacters(
  keyboard: Keyboard | null,
  date?: dayjs.Dayjs | null,
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
      const filters: FilterQuery = {};
      if (date) {
        filters.date = date;
      }
      const data = await getCharacterCounts(keyboard.id, filters);
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [date, keyboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
