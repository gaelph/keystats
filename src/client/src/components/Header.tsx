import React, { useEffect } from "react";
import { useFetchContext } from "~/state/fetch.js";
import { useKeyboardActions, useKeyboardContext } from "~/state/keyboard.js";
import { useKeyboardDataActions } from "~/state/keyboardData.js";
import { useKeyboardsContext } from "~/state/keyboards.js";
import KeyboardSelector from "./KeyboardSelector.js";

import * as classes from "./Header.module.css";

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

  const loading = pendingCount !== 0;

  return (
    <header>
      <div>
        <KeyboardSelector
          selectedKeyboard={keyboard}
          keyboards={keyboards || []}
          onChange={(kb) => setKeyboard(kb)}
        />
      </div>
      <div className={classes.refreshButton}>
        <button
          role="button"
          disabled={loading}
          aria-busy={loading}
          onClick={refresh}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>
      <ul className={classes.error}>
        {errors.map((error, idx) => (
          <li key={`${error.message}-${idx}`}>
            <span className="material-symbols-sharp">error</span>
            <span className={classes.errorMessage}>{error.message}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
