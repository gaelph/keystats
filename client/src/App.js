import "material-symbols/sharp.css";
import "./App.css";

import { useCallback, useMemo, useState, useEffect } from "react";

import useCounts from "./hooks/useCounts.js";
import useKeyboards from "./hooks/useKeyboards.js";
import useKeymaps from "./hooks/useKeymaps.js";
import useCharacters from "./hooks/useCharacters.js";
import useHandAndFingerUsage from "./hooks/useHandAndFingerUsage.js";
import HeatmapComponent from "./components/Heatmap.js";
import StatsComponent from "./components/Stats.js";
import { getTotalKeyPresses } from "./lib/sums.js";

function getUsableLayers(layers) {
  return layers.slice(0, 6);
}

function App() {
  const [keyboard, setKeyboard] = useState(null);
  const [keyboards, loadingKeyboards, errorKeyboards /*, refreshKeyboards*/] =
    useKeyboards();
  const [keymaps, loadingKeymaps, errorKeymaps, refreshKeymaps] =
    useKeymaps(keyboard);
  const [characters, loadingCharacters, errorCharacters, refreshCharacters] =
    useCharacters(keyboard);
  const [counts, loadingCounts, errorCounts, refreshCounts] =
    useCounts(keyboard);
  const [
    handAndFingerUsage,
    loadingHandAndFingerUsage,
    errorHandAndFingerUsage,
    refreshHandAndFingerUsage,
  ] = useHandAndFingerUsage(keyboard);

  const refreshAllData = useCallback(() => {
    refreshKeymaps();
    refreshCounts();
    refreshCharacters();
    refreshHandAndFingerUsage();
  }, [
    refreshCharacters,
    refreshCounts,
    refreshHandAndFingerUsage,
    refreshKeymaps,
  ]);

  const usableLayers = useMemo(() => {
    if (counts && counts.keymapUsage) {
      return getUsableLayers(counts.keymapUsage);
    }
    return null;
  }, [counts]);

  const totalKeyPresses = useMemo(() => {
    if (usableLayers) {
      return getTotalKeyPresses(usableLayers);
    }
    return null;
  }, [usableLayers]);

  useEffect(() => {
    if (keyboards && Array.isArray(keyboards) && keyboards.length > 0) {
      setKeyboard(keyboards[0]);
    }
  }, [keyboards]);

  const loading =
    loadingKeyboards ||
    loadingKeymaps ||
    loadingCounts ||
    loadingHandAndFingerUsage ||
    loadingCharacters;

  const error =
    errorKeyboards ||
    errorKeymaps ||
    errorCounts ||
    errorHandAndFingerUsage ||
    errorCharacters;

  return (
    <div className="App">
      <header>
        {keyboard && keyboard.name && <h1>{keyboard.name}</h1>}
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {counts && !loading && (
          <button onClick={refreshAllData}>Refresh</button>
        )}
      </header>
      <div class="content-container">
        <div class="layer-container">
          {counts && keymaps && (
            <ul>
              {usableLayers &&
                usableLayers.map((matrix, layerId) => {
                  if (matrix === null || matrix === undefined) return null;
                  if (!keymaps[layerId]) return null;
                  return (
                    <li key={layerId}>
                      <HeatmapComponent
                        data={counts.keymapUsage}
                        matrix={matrix}
                        layerId={layerId}
                        layer={keymaps[layerId]}
                        layerTotal={totalKeyPresses.byLayer[layerId]}
                        total={totalKeyPresses.total}
                      />
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
        {counts && (
          <div class="stats-container">
            <StatsComponent
              handAndFingerUsage={handAndFingerUsage}
              counts={counts}
              characters={characters}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
