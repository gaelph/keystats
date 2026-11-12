import React, { useEffect } from "react";
import KeyboardSelector from "./KeyboardSelector.js";

import useKeyboards from "~/hooks/useKeyboards.js";
import useFetchStatus from "~/hooks/useFetchStatus.js";

import ErrorIcon from "@material-symbols/svg-400/sharp/error.svg";
import * as classes from "./Header.module.css";
import { useProjectionStore } from "~/state/projection.js";
import { useAppState } from "~/state/appState.js";
import { useTrendsRefresh } from "~/state/trendsRefresh.js";

export default function Header(): React.ReactElement {
  const { loading, errors, refresh } = useFetchStatus();
  const { keyboard, keyboards, setKeyboard } = useKeyboards();
  const view = useProjectionStore((state) => state.view);
  const projectionRequest = useProjectionStore((state) => state.request);
  const loadProjection = useProjectionStore((state) => state.load);
  const date = useAppState((state) => state.date);
  const refreshTrends = useTrendsRefresh((state) => state.refresh);
  const busy = loading || (view === "comparison" && projectionRequest.status === "loading");

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
          disabled={busy}
          aria-busy={busy}
          onClick={() => {
            refresh();
             if (view === "comparison" && keyboard) void loadProjection({ keyboardId: keyboard.id, date: date?.format("YYYY-MM-DD") || null }, true);
             if (view === "trends") refreshTrends();
          }}
        >
          {busy ? "Loading…" : "Refresh"}
        </button>
      </div>
      <ul className={classes.error}>
        {errors.map((error, idx) => (
          <li key={`${error.message}-${idx}`}>
            <ErrorIcon className="small" />
            <span className={classes.errorMessage}>{error.message}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
