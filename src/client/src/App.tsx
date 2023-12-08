import React from "react";
import "./App.css";

import KeymapsComponent from "~/components/Keymaps.js";
import StatsComponent from "~/components/Stats.js";
import Dates from "~/components/Dates.js";
import { useStoreInit } from "./state/appState.js";
import Header from "./components/Header.js";

function App() {
  useStoreInit();
  return (
    <div className="App keystats">
      <Header />
      <Dates />
      <div className="content-container">
        <KeymapsComponent />
        <StatsComponent />
      </div>
    </div>
  );
}

export default App;
