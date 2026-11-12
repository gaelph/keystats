import React, { Suspense, lazy } from "react";
import "./App.css";

import KeymapsComponent from "~/components/Keymaps.js";
import StatsComponent from "~/components/Stats.js";
import Dates from "~/components/Dates.js";
import { useStoreInit } from "./state/appState.js";
import Header from "./components/Header.js";
import LayoutComparison from "./components/projection/LayoutComparison.js";
import { useProjectionStore } from "./state/projection.js";
const Trends = lazy(() => import("./components/trends/Trends.js"));

function App() {
  useStoreInit();
  const view = useProjectionStore((state) => state.view);
  const setView = useProjectionStore((state) => state.setView);
  return (
    <div className="App keystats">
      <Header />
      <div hidden={view === "trends"}><Dates /></div>
      <div className="projection-view-controls" role="tablist" aria-label="Keyboard analysis views"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const views = ["observed", "comparison", "trends"] as const;
          const next = event.key === "Home" ? views[0] : event.key === "End" ? views[2] : views[(views.indexOf(view) + (event.key === "ArrowRight" ? 1 : 2)) % 3];
          setView(next);
          document.getElementById(`${next}-tab`)?.focus();
        }}>
        <button type="button" id="observed-tab" role="tab" tabIndex={view === "observed" ? 0 : -1} aria-selected={view === "observed"} aria-controls="observed-panel" onClick={() => setView("observed")}>Observed statistics</button>
        <button type="button" id="comparison-tab" role="tab" tabIndex={view === "comparison" ? 0 : -1} aria-selected={view === "comparison"} aria-controls="comparison-panel" onClick={() => setView("comparison")}>Layout comparison</button>
        <button type="button" id="trends-tab" role="tab" tabIndex={view === "trends" ? 0 : -1} aria-selected={view === "trends"} aria-controls="trends-panel" onClick={() => setView("trends")}>Trends</button>
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
      <div id="trends-panel" role="tabpanel" aria-labelledby="trends-tab" hidden={view !== "trends"}>
        {view === "trends" && <Suspense fallback={<p role="status">Loading Trends…</p>}><Trends /></Suspense>}
      </div>
    </div>
  );
}

export default App;
