import "./App.css";

import useData from "./hooks/useData";
import useLayers from "./hooks/useLayers";
import HeatmapComponent from "./components/Heatmap";

function App() {
  const [data, loading, error, refresh] = useData();
  const [layers, loadingLayers, errorLayers, refreshLayers] = useLayers();
  console.log("LS -> client/src/App.js:9 -> layers: ", layers);

  return (
    <div className="App">
      {(loading || loadingLayers) && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {data && !loading && <button onClick={refresh}>Refresh</button>}
      {data && layers && (
        <ul>
          {data.layers.map((matrix, layerId) => {
            if (matrix === null || matrix === undefined) return null;
            if (!layers[layerId]) return null;
            return (
              <li key={layerId}>
                <HeatmapComponent
                  data={data}
                  matrix={matrix}
                  layerId={layerId}
                  layer={layers[layerId]}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
