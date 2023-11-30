import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import dayjs from "dayjs";
import { useKeyboardContext } from "./keyboard.js";
import useDates from "~/hooks/useDates.js";

interface DateContextType {
  dates: dayjs.Dayjs[];
  date: dayjs.Dayjs | null;
}

interface SetDatesAction {
  type: "SET_DATES";
  payload: dayjs.Dayjs[];
}

interface SetDateAction {
  type: "SET_DATE";
  payload: dayjs.Dayjs | null;
}

type DateActionType = SetDatesAction | SetDateAction;

interface DateActionsType {
  setDates: (dates: dayjs.Dayjs[]) => void;
  setDate: (date: dayjs.Dayjs | null) => void;
  refresh: () => void;
}

const DateContext = createContext<DateContextType>({ dates: [], date: null });
const DateActionsContext = createContext<DateActionsType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDates: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDate: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refresh: () => {},
});

export function useDatesContext() {
  return useContext(DateContext);
}

export function useDatesActions() {
  return useContext(DateActionsContext);
}

function dateReducer(
  state: DateContextType,
  action: DateActionType,
): DateContextType {
  switch (action.type) {
    case "SET_DATES":
      return {
        ...state,
        dates: action.payload,
      };

    case "SET_DATE":
      return {
        ...state,
        date: action.payload,
      };
  }

  return state;
}

export function DatesProvider({
  children,
}: React.PropsWithChildren): React.ReactElement {
  const [state, dispatch] = useReducer(dateReducer, {
    dates: [],
    date: null,
  });

  const keyboard = useKeyboardContext();

  const [dates, refreshDates] = useDates(keyboard);

  const actions = useMemo(() => {
    return {
      setDates(dates: dayjs.Dayjs[]) {
        dispatch({ type: "SET_DATES", payload: dates });
      },
      setDate(date: dayjs.Dayjs | null) {
        dispatch({ type: "SET_DATE", payload: date });
      },
      refresh() {
        refreshDates();
      },
    };
  }, [dispatch]);

  useEffect(() => {
    if (dates) actions.setDates(dates);
  }, [dates, actions]);

  return (
    <DateContext.Provider value={state}>
      <DateActionsContext.Provider value={actions}>
        {children}
      </DateActionsContext.Provider>
    </DateContext.Provider>
  );
}
