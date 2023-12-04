import { useAppState } from "~/state/appState.js";
import { KeyboardDataState } from "~/state/keyboardData.js";

export default function useCharacters(): Pick<KeyboardDataState, "characters"> {
  const characters = useAppState((state) => state.characters);

  return { characters };
}
