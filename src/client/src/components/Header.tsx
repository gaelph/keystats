import React, { useEffect } from "react";
import { useFetchContext } from "~/state/fetch.js";
import { useKeyboardActions, useKeyboardContext } from "~/state/keyboard.js";
import { useKeyboardDataActions } from "~/state/keyboardData.js";
import { useKeyboardsContext } from "~/state/keyboards.js";
import KeyboardSelector from "./KeyboardSelector.js";

export default function Header(): React.ReactElement {
  const { pendingCount, errors } = useFetchContext();
  const keyboards = useKeyboardsContext();
  const keyboard = useKeyboardContext();
  const { setKeyboard } = useKeyboardActions();
  const { refresh } = useKeyboardDataActions();

  // Set the first keyboard of the list as the default
  // TODO: use LocalStorage to keep that setting between page reloads
  useEffect(() => {
    if (!keyboard && keyboards && keyboards.length !== 0) {
      setKeyboard(keyboards[0]);
    }
  }, [keyboard, keyboards]);

  return (
    <header>
      <div>
        <KeyboardSelector
          selectedKeyboard={keyboard}
          keyboards={keyboards || []}
          onChange={(kb) => setKeyboard(kb)}
        />
      </div>
      <div>
        {pendingCount !== 0 ? (
          <div>Loading...</div>
        ) : (
          <button onClick={refresh}>Refresh</button>
        )}
      </div>
      <ul className="error">
        {errors.map((error, idx) => (
          <li key={`${error.message}-${idx}`}>
            <span className="material-symbols-sharp">error</span>
            <span className="error-message">{error.message}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
