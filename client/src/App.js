import "./App.css";

import { useCallback, useMemo } from "react";

import useData from "./hooks/useData.js";
import useLayers from "./hooks/useLayers.js";
import HeatmapComponent from "./components/Heatmap.js";
import StatsComponent from "./components/Stats.js";
import { getTotalKeyPresses } from "./lib/sums.js";

function getUsableLayers(layers) {
  return layers.slice(0, 6);
}

function App() {
  const [data, loading, error, refresh] = useData();
  const [layers, loadingLayers, errorLayers, refreshLayers] = useLayers();

  const refreshAllData = useCallback(() => {
    refresh();
    refreshLayers();
  }, [refresh, refreshLayers]);

  const usableLayers = useMemo(() => {
    if (data && data.layers) {
      return getUsableLayers(data.layers);
    }
    return null;
  }, [data]);

  const totalKeyPresses = useMemo(() => {
    if (usableLayers) {
      return getTotalKeyPresses(usableLayers);
    }
    return null;
  }, [usableLayers]);

  return (
    <div className="App">
      <header>
        {(loading || loadingLayers) && <div>Loading...</div>}
        {(error || errorLayers) && <div>{error || errorLayers}</div>}
        {data && !loading && <button onClick={refreshAllData}>Refresh</button>}
      </header>
      <div class="content-container">
        <div class="layer-container">
          {data && layers && (
            <ul>
              {usableLayers.map((matrix, layerId) => {
                if (matrix === null || matrix === undefined) return null;
                if (!layers[layerId]) return null;
                return (
                  <li key={layerId}>
                    <HeatmapComponent
                      data={data}
                      matrix={matrix}
                      layerId={layerId}
                      layer={layers[layerId]}
                      layerTotal={totalKeyPresses.byLayer[layerId]}
                      total={totalKeyPresses.total}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {data && (
          <div class="stats-container">
            <StatsComponent data={data} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
