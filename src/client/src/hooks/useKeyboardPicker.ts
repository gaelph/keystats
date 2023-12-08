import { useAppState } from "~/state/appState.js";
import { useShallow } from "zustand/react/shallow";

export default function useKeyboardPicker() {
  const { opened, open, close } = useAppState(
    useShallow(({ keyboardPicker }) => keyboardPicker),
  );

  return { opened, open, close };
}
