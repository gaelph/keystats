import { KeyboardDataState } from "~/state/keyboardData.js";
import { useAppState } from "~/state/appState.js";

export default function useKeymaps(): Pick<KeyboardDataState, "keymaps"> {
  const keymaps = useAppState((state) => state.keymaps);

  return {
    keymaps,
  };
}
