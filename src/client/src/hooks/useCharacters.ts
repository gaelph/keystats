import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import { getCharacterCounts, Keyboard } from "../lib/api.js";
import { FilterQuery } from "keystats-common/dto/keyboard";
import { useFetchActions } from "~/state/fetch.js";

type Data = Awaited<ReturnType<typeof getCharacterCounts>>;

export default function useCharacters(
  keyboard: Keyboard | null,
  date?: dayjs.Dayjs | null,
): [Data | null, () => Promise<void>] {
  const [state, setState] = useState<Data | null>(null);
  const { setLoading, addError } = useFetchActions();

  const fetchData = useCallback(async () => {
    if (!keyboard) {
      return;
    }
    setLoading(true);
    try {
      const filters: FilterQuery = {};
      if (date) {
        filters.date = date;
      }
      const data = await getCharacterCounts(keyboard.id, filters);
      setState(data);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        addError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [date, keyboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state, fetchData];
}
