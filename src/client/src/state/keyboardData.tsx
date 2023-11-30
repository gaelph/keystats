import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import useCharacters from "~/hooks/useCharacters.js";
import useCounts from "~/hooks/useCounts.js";
import useHandAndFingerUsage from "~/hooks/useHandAndFingerUsage.js";
import useKeymaps from "~/hooks/useKeymaps.js";
import {
  getCharacterCounts,
  getHandAndFingerUsage,
  getKeyboardKeymaps,
  getTotalCounts,
} from "~/lib/api.js";
import { useDatesActions, useDatesContext } from "./date.js";
import { useKeyboardContext } from "./keyboard.js";

interface KeyboardDataContextType {
  keymaps: Awaited<ReturnType<typeof getKeyboardKeymaps>>;
  characters: Awaited<ReturnType<typeof getCharacterCounts>>;
  counts: Awaited<ReturnType<typeof getTotalCounts>>;
  handAndFingerUsage: Awaited<ReturnType<typeof getHandAndFingerUsage>>;
}

interface SetKeymapsAction {
  type: "SET_KEYMAPS";
  payload: Awaited<ReturnType<typeof getKeyboardKeymaps>>;
}

interface SetCharactersAction {
  type: "SET_CHARACTERS";
  payload: Awaited<ReturnType<typeof getCharacterCounts>>;
}

interface SetCounts {
  type: "SET_COUNTS";
  payload: Awaited<ReturnType<typeof getTotalCounts>>;
}

interface SetHandAndFingerUsage {
  type: "SET_HAND_AND_FINGER_USAGE";
  payload: Awaited<ReturnType<typeof getHandAndFingerUsage>>;
}

type KeyboardDataActionType =
  | SetKeymapsAction
  | SetCharactersAction
  | SetCounts
  | SetHandAndFingerUsage;

interface KeyboardDataActionsType {
  setKeymaps: (keymaps: Awaited<ReturnType<typeof getKeyboardKeymaps>>) => void;
  setCharacters: (
    characters: Awaited<ReturnType<typeof getCharacterCounts>>,
  ) => void;
  setCounts: (counts: Awaited<ReturnType<typeof getTotalCounts>>) => void;
  setHandAndFingerUsage: (
    handAndFingerUsage: Awaited<ReturnType<typeof getHandAndFingerUsage>>,
  ) => void;
  refresh: () => void;
}

const KeyboardDataActions = createContext<KeyboardDataActionsType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setKeymaps: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCharacters: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCounts: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setHandAndFingerUsage: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refresh: () => {},
});

const DEFAULT_KEYBOARD_DATA = {
  keymaps: [],
  characters: { records: [], totalCharacters: 0 },
  counts: {
    keymapUsage: [],
    layerUsage: {},
    rowUsage: {},
    handUsage: {
      0: 0,
      1: 0,
    },
    fingerUsage: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    },
    totalKeypresses: 0,
  },
  handAndFingerUsage: {
    handRepetitions: [[], []],
    fingerRepetitions: [],
  },
};

const KeyboardDataContext = createContext<KeyboardDataContextType>(
  DEFAULT_KEYBOARD_DATA,
);

export function useKeyboardData() {
  return useContext(KeyboardDataContext);
}

export function useKeyboardDataActions() {
  return useContext(KeyboardDataActions);
}

function keyboardDataReducer(
  state: KeyboardDataContextType,
  action: KeyboardDataActionType,
): KeyboardDataContextType {
  switch (action.type) {
    case "SET_KEYMAPS":
      return {
        ...state,
        keymaps: action.payload,
      };

    case "SET_CHARACTERS":
      return {
        ...state,
        characters: action.payload,
      };

    case "SET_COUNTS":
      return {
        ...state,
        counts: action.payload,
      };

    case "SET_HAND_AND_FINGER_USAGE":
      return {
        ...state,
        handAndFingerUsage: action.payload,
      };
  }

  return state;
}

export function KeyboardDataProvider({
  children,
}: React.PropsWithChildren): React.ReactElement {
  const [data, dispatch] = useReducer(
    keyboardDataReducer,
    DEFAULT_KEYBOARD_DATA,
  );

  const keyboard = useKeyboardContext();
  const { date } = useDatesContext();
  const { refresh: refreshDates } = useDatesActions();

  const [keymaps, refreshKeymaps] = useKeymaps(keyboard);
  const [characters, refreshCharacters] = useCharacters(keyboard, date);
  const [counts, refreshCounts] = useCounts(keyboard, date);
  const [handAndFingerUsage, refreshHandAndFingerUsage] =
    useHandAndFingerUsage(keyboard);

  const actions = useMemo(() => {
    return {
      setKeymaps: (keymaps: Awaited<ReturnType<typeof getKeyboardKeymaps>>) => {
        dispatch({ type: "SET_KEYMAPS", payload: keymaps });
      },
      setCharacters: (
        characters: Awaited<ReturnType<typeof getCharacterCounts>>,
      ) => {
        dispatch({ type: "SET_CHARACTERS", payload: characters });
      },
      setCounts: (counts: Awaited<ReturnType<typeof getTotalCounts>>) => {
        dispatch({ type: "SET_COUNTS", payload: counts });
      },
      setHandAndFingerUsage: (
        handAndFingerUsage: Awaited<ReturnType<typeof getHandAndFingerUsage>>,
      ) => {
        dispatch({
          type: "SET_HAND_AND_FINGER_USAGE",
          payload: handAndFingerUsage,
        });
      },
      refresh: () => {
        refreshDates();
        refreshKeymaps();
        refreshCharacters();
        refreshCounts();
        refreshHandAndFingerUsage();
      },
    };
  }, [dispatch]);

  useEffect(() => {
    if (keymaps) actions.setKeymaps(keymaps);
  }, [keymaps, actions]);

  useEffect(() => {
    if (characters) actions.setCharacters(characters);
  }, [characters, actions]);

  useEffect(() => {
    if (counts) actions.setCounts(counts);
  }, [counts, actions]);

  useEffect(() => {
    if (handAndFingerUsage) {
      actions.setHandAndFingerUsage(handAndFingerUsage);
    }
  }, [handAndFingerUsage, actions]);

  return (
    <KeyboardDataContext.Provider value={data}>
      <KeyboardDataActions.Provider value={actions}>
        {children}
      </KeyboardDataActions.Provider>
    </KeyboardDataContext.Provider>
  );
}
