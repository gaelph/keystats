/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useCallback } from "react";
import * as Heatmap from "heatmap.js";
import IconOrChar from "./IconOrChar.js";
import { Keymap } from "keystats-common/dto/keyboard";

import * as classes from "./Heatmap.module.css";
import { KEY_WIDTH, HEATMAP_GRADIENT, observedHeatmapData, comparisonHeatmapData,
  matrixHeatmapPoints, type ComparisonHeatmapScale } from "~/lib/heatmap.js";

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
  showTitle?: boolean;
  normalization?: ComparisonHeatmapScale;
}

export default function HeatmapComponent({
  data,
  layerId,
  matrix,
  layer,
  total,
  showTitle = true,
  normalization,
}: HeatmapProps): JSX.Element {
  const canvasRef = useRef<HTMLDivElement>(null);
  const heatmap = useRef<Heatmap.HeatmapInstance | null>(null);
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
        gradient: HEATMAP_GRADIENT,
      });

      try {
        heatmap.current.setData(normalization
          ? comparisonHeatmapData(matrixHeatmapPoints(matrix), normalization)
          : observedHeatmapData(matrix, total));
      } catch (error) {
        console.error(error);
      }
    }
  }, [matrix, total, normalization]);

  const percent = useCallback(
    (n: number): string => (total ? (100 * n) / total : 0).toFixed(2),
    [total],
  );

  return (
    <>
      {showTitle && <h3>Layer #{layerId}</h3>}
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
