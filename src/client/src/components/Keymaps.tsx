import React from "react";
import { useKeyboardData } from "~/state/keyboardData.js";
import HeatmapComponent from "./Heatmap.js";

import * as classes from "./Keymaps.module.css";

export default function Keymaps() {
  const { counts, keymaps } = useKeyboardData();

  return (
    <div className={classes.layerContainer}>
      {counts && keymaps && (
        <ul>
          {counts.keymapUsage &&
            counts.keymapUsage.map((matrix, layerId) => {
              if (matrix === null || matrix === undefined) return null;
              if (!keymaps[layerId]) return null;
              return (
                <li key={layerId}>
                  <HeatmapComponent
                    data={counts.keymapUsage}
                    matrix={matrix}
                    layerId={layerId}
                    layer={keymaps[layerId]}
                    total={counts.totalKeypresses}
                  />
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
