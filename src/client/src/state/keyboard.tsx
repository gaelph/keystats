import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Keyboard } from "~/lib/api.js";

interface SetKeybaordAction {
  type: "SET_KEYBOARD";
  payload: Keyboard;
}

const KeyboardContext = createContext<Keyboard | null>(null);
const KeyboardActions = createContext<{
  setKeyboard: (keyboard: Keyboard) => void;
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setKeyboard: () => {},
});

export function useKeyboardContext() {
  return useContext(KeyboardContext);
}

export function useKeyboardActions() {
  return useContext(KeyboardActions);
}

function keyboardReducer(
  state: Keyboard | null,
  action: SetKeybaordAction,
): Keyboard | null {
  return action.type === "SET_KEYBOARD" ? action.payload : state;
}

const LS_KEY = "keystats:keyboard";
function readFromLocalStorage(): Keyboard | null {
  const data = window.localStorage.getItem(LS_KEY);
  if (!data) return null;

  let keyboard: Keyboard | null;
  try {
    keyboard = JSON.parse(data) as unknown as Keyboard;
  } catch (error) {
    console.error(error);
    keyboard = null;
  }

  return keyboard;
}

function writeToLocalStorage(keyboard: Keyboard | null) {
  if (keyboard) {
    const asString = JSON.stringify(keyboard);

    window.localStorage.setItem(LS_KEY, asString);
  } else if (window.localStorage.getItem(LS_KEY)) {
    window.localStorage.removeItem(LS_KEY);
  }
}

export function KeyboardProvider({
  children,
}: React.PropsWithChildren): React.ReactElement {
  const [keyboard, dispatch] = useReducer(
    keyboardReducer,
    readFromLocalStorage(),
  );

  const actions = useMemo(() => {
    return {
      setKeyboard(keyboard: Keyboard) {
        dispatch({ type: "SET_KEYBOARD", payload: keyboard });
        writeToLocalStorage(keyboard);
      },
    };
  }, [dispatch]);

  return (
    <KeyboardContext.Provider value={keyboard}>
      <KeyboardActions.Provider value={actions}>
        {children}
      </KeyboardActions.Provider>
    </KeyboardContext.Provider>
  );
}
