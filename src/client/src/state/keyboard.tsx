import { StateCreator } from "zustand";
import { Keyboard } from "~/lib/api.js";

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

export interface KeyboardState {
  keyboard: Keyboard | null;
  setKeyboard: (keyboard: Keyboard) => void;
}

export const keyboardStore: StateCreator<
  KeyboardState,
  [],
  [],
  KeyboardState
> = (set) => ({
  keyboard: readFromLocalStorage(),
  setKeyboard(keyboard: Keyboard) {
    set(() => {
      writeToLocalStorage(keyboard);
      return { keyboard: keyboard };
    });
  },
});
