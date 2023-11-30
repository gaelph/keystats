import React, { createContext, useContext, useEffect } from "react";
import { Keyboard } from "~/lib/api.js";
import useKeyboards from "~/hooks/useKeyboards.js";
import { useFetchActions } from "./fetch.js";

type KeyboardsContextType = Keyboard[];
const DEFAULT_KEYBOARDS_CONTEXT: Keyboard[] = [];

const KeyboardsContext = createContext<KeyboardsContextType>(
  DEFAULT_KEYBOARDS_CONTEXT,
);

export function useKeyboardsContext() {
  return useContext(KeyboardsContext);
}

export function KeyboardsProvider({
  children,
}: React.PropsWithChildren): React.ReactElement {
  const [keyboards] = useKeyboards();

  return (
    <KeyboardsContext.Provider value={keyboards || []}>
      {children}
    </KeyboardsContext.Provider>
  );
}
