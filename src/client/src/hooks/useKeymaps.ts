import { useReducer, useCallback, useEffect, useState } from "react";
import { setLoading, setError, setData } from "../store/actions.js";
import dataReducer, { State } from "../store/reducer.js";

import { getKeyboardKeymaps, Keyboard } from "../lib/api.js";
import { useFetchActions } from "~/state/fetch.js";
type Data = Awaited<ReturnType<typeof getKeyboardKeymaps>>;

export default function useData(
  keyboard: Keyboard | null,
): [Data | null, () => Promise<void>] {
  const [state, setState] = useState<Data | null>(null);
  const { setLoading, addError } = useFetchActions();

  const fetchData = useCallback(async () => {
    if (!keyboard) {
      return;
    }

    setLoading(true);
    try {
      const data = await getKeyboardKeymaps(keyboard.id);
      setState(data);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [keyboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state, fetchData];
}
