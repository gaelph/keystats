import React, { useEffect } from "react";
import KeyboardSelector from "./KeyboardSelector.js";

import useKeyboards from "~/hooks/useKeyboards.js";
import useFetchStatus from "~/hooks/useFetchStatus.js";

import * as classes from "./Header.module.css";

export default function Header(): React.ReactElement {
  const { loading, errors, refresh } = useFetchStatus();
  const { keyboard, keyboards, setKeyboard } = useKeyboards();

  // Set the first keyboard of the list as the default
  // If there were non in the storage
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
