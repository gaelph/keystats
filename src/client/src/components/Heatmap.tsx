/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useCallback } from "react";
// @ts-ignore
import * as Heatmap from "heatmap.js";
import IconOrChar from "./IconOrChar.js";
import { Keymap } from "keystats-common/dto/keyboard";

import * as classes from "./Heatmap.module.css";

const KEY_WIDTH = 60;

function formatData(
  matrix: number[][],
  total: number,
): {
  max: number;
  min: number;
  data: { x: number; y: number; value: number }[];
} {
  let entries: { x: number; y: number; value: number }[] = [];
  let max = total;

  Object.entries(matrix).forEach(([r, row]) => {
    Object.entries(row || {}).forEach(([c, col]) => {
      const entry = {
        x: (parseInt(c) + 1) * 60 - 30,
        y: (parseInt(r) + 1) * 60 - 30,
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
  const min = entries.map((e) => e.value).reduce((m, e) => (e < m ? e : m), 0);

  return {
    max,
    min,
    data: entries,
  };
}

function Char({ codes }: { codes: Keymap[] }) {
  const plain = codes.find((c) => c.type === "plain");
  const alter = codes.find((c) => c.type !== "plain");
  let char = "";

  if (plain && plain.keycode !== "") {
    char = plain.character?.toLocaleUpperCase() || "";
  } else if (alter) {
    char = alter.character || "";
  }

  return <IconOrChar>{char}</IconOrChar>;
}

interface HeatmapProps {
  data: number[][][];
  layerId: number;
  matrix: number[][];
  layer: Keymap[][][];
  total: number;
}

export default function HeatmapComponent({
  data,
  layerId,
  matrix,
  layer,
  total,
}: HeatmapProps): JSX.Element {
  const canvasRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatmap = useRef<any | null>();
  useEffect(() => {
    if (
      canvasRef.current &&
      matrix &&
      (total !== null || total !== undefined)
    ) {
      for (const child of canvasRef.current.children) {
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

  const percent = useCallback(
    (n: number): string => ((100 * n) / total).toFixed(2),
    [total],
  );

  return (
    <>
      <h3>Layer #{layerId}</h3>
      <div className={classes.heatmap} ref={canvasRef}>
        <div>
          {layer.map((layerRow, r) => (
            <div className={classes.row} key={`${layerId}_${r}`}>
              {layerRow.map((char, c) => (
                <div
                  className={classes.key}
                  key={`${layerId}_${r}_${c}`}
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
