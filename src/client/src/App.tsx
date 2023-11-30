import React from "react";
import "material-symbols/sharp.css";
import "./App.css";

import KeymapsCompenent from "~/components/Keymaps.js";
import StatsComponent from "~/components/Stats.js";
import Dates from "~/components/Dates.js";
import ApplicationStateProvider from "./state/appState.js";
import Header from "./components/Header.js";

function App() {
  return (
    <ApplicationStateProvider>
      <div className="App keystats">
        <Header />
        <Dates />
        <div className="content-container">
          <KeymapsCompenent />
          <StatsComponent />
        </div>
      </div>
    </ApplicationStateProvider>
  );
}

export default App;
