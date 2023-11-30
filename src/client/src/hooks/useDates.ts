import { useCallback, useEffect, useState } from "react";

import { getDates, Keyboard } from "../lib/api.js";
import dayjs from "dayjs";
import { useFetchActions } from "~/state/fetch.js";
type Data = dayjs.Dayjs[];

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
      const data = await getDates(keyboard.id);
      setState(data.map((date) => dayjs(date)));
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        addError(error);
      }
    }
    setLoading(false);
  }, [keyboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state, fetchData];
}
