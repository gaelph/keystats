import { useRef, useEffect } from "react";
import * as Heatmap from "heatmap.js";

import Layers from "../layers";
import { formatKeyCode } from "../lib/keycodes";

const KEY_WIDTH = 59;

const rowStyle = {
  height: KEY_WIDTH,
  display: "flex",
  flexDirection: "row",
  width: "1200",
};

function formatData(matrix) {
  let entries = [];
  let max = 0;

  Object.entries(matrix).forEach(([r, row]) => {
    Object.entries(row).forEach(([c, col]) => {
      const entry = {
        x: (c + 1) * 6 + 40,
        y: (r + 1) * 6 + 40,
        value: col,
      };
      if (entry.value > max) max = entry.value;

      entries.push(entry);
    });
  });

  entries = entries.map((e) => {
    e.value = e.value > 0 ? e.value / max : 0.001;
    e.value = 1 + Math.log(e.value / 4 + 0.01);
    return e;
  });
  max = entries.map((e) => e.value).reduce((m, e) => (e > m ? e : m), 0);
  let min = entries.map((e) => e.value).reduce((m, e) => (e < m ? e : m), 0);
  // max = 1;
  // console.log(entries);

  return {
    max,
    min,
    data: entries,
  };
}

export default function HeatmapComponent({ data, layerId, matrix, layer }) {
  const canvasRef = useRef();
  const heatmap = useRef();
  useEffect(() => {
    if (canvasRef.current) {
      for (let child of canvasRef.current.children) {
        if (child.tagName.toLowerCase() === "canvas") {
          child.remove();
        }
      }
      heatmap.current = Heatmap.create({
        container: canvasRef.current,
        radius: KEY_WIDTH,
      });

      heatmap.current.setData(formatData(matrix));
    }
  }, [matrix]);

  return (
    <>
      <h3>Layer #{layerId}</h3>
      <div
        id="heatmap"
        style={{ width: "1200px", height: "400px" }}
        ref={canvasRef}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 17,
            left: 17,
            width: "100%",
            height: "100%",
          }}
        >
          {console.log(layer) || null}
          {layer.map((layerRow, r) => (
            <div style={rowStyle}>
              {console.log(layerRow) || null}
              {layerRow.map((char, c) => (
                <div className="key" title={data.layers[layerId][r][c]}>
                  <span>{formatKeyCode(char)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
