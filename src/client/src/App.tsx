import React from "react";
import "./App.css";

import KeymapsComponent from "~/components/Keymaps.js";
import StatsComponent from "~/components/Stats.js";
import Dates from "~/components/Dates.js";
import { useStoreInit } from "./state/appState.js";
import Header from "./components/Header.js";
import LayoutComparison from "./components/projection/LayoutComparison.js";
import { useProjectionStore } from "./state/projection.js";

function App() {
  useStoreInit();
  const view = useProjectionStore((state) => state.view);
  const setView = useProjectionStore((state) => state.setView);
  return (
    <div className="App keystats">
      <Header />
      <Dates />
      <div className="projection-view-controls" role="tablist" aria-label="Keyboard analysis views"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? "observed" : event.key === "End" ? "comparison" : view === "observed" ? "comparison" : "observed";
          setView(next);
          document.getElementById(`${next}-tab`)?.focus();
        }}>
        <button type="button" id="observed-tab" role="tab" tabIndex={view === "observed" ? 0 : -1} aria-selected={view === "observed"} aria-controls="observed-panel" onClick={() => setView("observed")}>Observed statistics</button>
        <button type="button" id="comparison-tab" role="tab" tabIndex={view === "comparison" ? 0 : -1} aria-selected={view === "comparison"} aria-controls="comparison-panel" onClick={() => setView("comparison")}>Layout comparison</button>
      </div>
      <div id="observed-panel" role="tabpanel" aria-labelledby="observed-tab" hidden={view !== "observed"}>
        <div className="content-container">
          {view === "observed" && <KeymapsComponent />}
          <StatsComponent />
        </div>
      </div>
      <div id="comparison-panel" role="tabpanel" aria-labelledby="comparison-tab" hidden={view !== "comparison"}>
        {view === "comparison" && <LayoutComparison />}
      </div>
    </div>
  );
}

export default App;
