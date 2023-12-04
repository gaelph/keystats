import { KeyboardState } from "~/state/keyboard.js";
import { useAppState } from "~/state/appState.js";
import { KeyboardsState } from "~/state/keyboards.js";

export default function useKeyboards(): Pick<
  KeyboardState & KeyboardsState,
  "keyboard" | "keyboards" | "setKeyboard"
> {
  const keyboards = useAppState((state) => state.keyboards);
  const [keyboard, setKeyboard] = useAppState((state) => [
    state.keyboard,
    state.setKeyboard,
  ]);

  return { keyboard, keyboards, setKeyboard };
}
