import { useReducer, useCallback, useEffect } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer, { State } from "../store/reducer.js";

import { getHandAndFingerUsage, Keyboard } from "../lib/api.js";
import dayjs from "dayjs";
import { FilterQuery } from "keystats-common/dto/keyboard";
type Data = Awaited<ReturnType<typeof getHandAndFingerUsage>>;

export default function useData(
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
      const data = await getHandAndFingerUsage(keyboard.id, filters);
      dispatch(setData(data));
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        dispatch(setError(error));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [keyboard, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.data, state.loading, state.error, fetchData];
}
