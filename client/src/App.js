import "./App.css";

import useData from "./hooks/useData";
import HeatmapComponent from "./components/Heatmap";

function App() {
  const [data, loading, error, refresh] = useData();

  return (
    <div className="App">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {data && !loading && <button onClick={refresh}>Refresh</button>}
      {data && (
        <ul>
          {data.layers.map((matrix, layerId) => {
            if (matrix === null || matrix === undefined) return null;
            return (
              <li key={layerId}>
                <HeatmapComponent
                  data={data}
                  matrix={matrix}
                  layerId={layerId}
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
