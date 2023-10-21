import { useRef, useEffect, useCallback } from "react";
import * as Heatmap from "heatmap.js";
import IconOrChar from "./IconOrChar.js";

const KEY_WIDTH = 60;

function formatData(matrix, total) {
  let entries = [];
  let max = total;

  Object.entries(matrix).forEach(([r, row]) => {
    Object.entries(row || {}).forEach(([c, col]) => {
      const entry = {
        x: (c + 1) * 6 + 24,
        y: (r + 1) * 6 + 24,
        value: col,
      };
      // if (entry.value > max) max = entry.value;

      entries.push(entry);
    });
  });

  entries = entries.map((e) => {
    e.value = e.value > 0 ? e.value / max : 0.001;
    e.value = 1 + Math.log(e.value / 0.5 + 0.01);
    return e;
  });
  max = entries.map((e) => e.value).reduce((m, e) => (e > m ? e : m), 0);
  let min = entries.map((e) => e.value).reduce((m, e) => (e < m ? e : m), 0);

  return {
    max,
    min,
    data: entries,
  };
}

function Char({ codes }) {
  const plain = codes.find((c) => c.type === "plain");
  const alter = codes.find((c) => c.type !== "plain");
  let char = "";

  if (plain && plain.keycode !== "") {
    char = plain.character?.toLocaleUpperCase() || "";
  } else {
    char = alter.character || "";
  }

  return <IconOrChar>{char}</IconOrChar>;
}

export default function HeatmapComponent({
  data,
  layerId,
  matrix,
  layer,
  total,
  layerTotal: _layerTotal,
}) {
  const canvasRef = useRef();
  const heatmap = useRef();
  useEffect(() => {
    if (
      canvasRef.current &&
      matrix &&
      (total !== null || total !== undefined)
    ) {
      for (let child of canvasRef.current.children) {
        if (child.tagName.toLowerCase() === "canvas") {
          child.remove();
        }
      }
      heatmap.current = Heatmap.create({
        container: canvasRef.current,
        radius: KEY_WIDTH,
      });

      heatmap.current.setData(formatData(matrix, total));
    }
  }, [matrix, total]);

  const percent = useCallback((n) => ((100 * n) / total).toFixed(2), [total]);

  return (
    <>
      <h3>Layer #{layerId}</h3>
      <div id="heatmap" ref={canvasRef}>
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {layer.map((layerRow, r) => (
            <div className="row">
              {layerRow.map((char, c) => (
                <div
                  className="key"
                  title={percent(data[layerId]?.[r]?.[c] || 0) + "%"}
                >
                  <Char codes={char}></Char>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
