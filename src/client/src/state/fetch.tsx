import React, { createContext, useContext, useMemo, useReducer } from "react";

interface FetchContext {
  pendingCount: number;
  errors: Error[];
}

interface FetchActionContext {
  setLoading: (loading: boolean) => void;
  addError: (error: Error) => void;
  clearErrors: () => void;
}

interface FetchSetLoading {
  type: "SET_LOADING";
  payload: boolean;
}

interface FetchAddError {
  type: "ADD_ERROR";
  payload: Error;
}

interface ClearErrors {
  type: "CLEAR_ERRORS";
}

type FetchAction = FetchSetLoading | FetchAddError | ClearErrors;

const Ctx = createContext<FetchContext>({
  pendingCount: 0,
  errors: [],
});

const ActionCtx = createContext<FetchActionContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLoading: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addError: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clearErrors: () => {},
});

export function useFetchContext() {
  const ctx = useContext(Ctx);

  return ctx;
}

export function useFetchActions() {
  return useContext(ActionCtx);
}

function fetchReducer(state: FetchContext, action: FetchAction): FetchContext {
  switch (action.type) {
    case "SET_LOADING":
      if (action.payload) {
        return {
          pendingCount: state.pendingCount + 1,
          errors: [],
        };
      } else {
        const pendingCount = state.pendingCount - 1;
        return {
          ...state,
          pendingCount: pendingCount >= 0 ? pendingCount : 0,
        };
      }
    case "ADD_ERROR":
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: [],
      };

    default:
      return state;
  }
}

export function FetchContextProvider({
  children,
}: React.PropsWithChildren): React.ReactElement {
  const [state, dispatch] = useReducer(fetchReducer, {
    pendingCount: 0,
    errors: [],
  });

  const actions = useMemo(() => {
    return {
      setLoading: (loading: boolean) => {
        dispatch({ type: "SET_LOADING", payload: loading });
      },
      addError: (error: Error) =>
        dispatch({ type: "ADD_ERROR", payload: error }),
      clearErrors: () => dispatch({ type: "CLEAR_ERRORS" }),
    };
  }, [dispatch]);

  return (
    <Ctx.Provider value={state}>
      <ActionCtx.Provider value={actions}>{children}</ActionCtx.Provider>
    </Ctx.Provider>
  );
}
