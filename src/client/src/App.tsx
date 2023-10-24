import React from "react";
import "material-symbols/sharp.css";
import "./App.css";

import { useCallback, useMemo, useState, useEffect } from "react";

import useCounts from "~/hooks/useCounts.js";
import useDates from "~/hooks/useDates.js";
import useKeyboards from "~/hooks/useKeyboards.js";
import useKeymaps from "~/hooks/useKeymaps.js";
import useCharacters from "~/hooks/useCharacters.js";
import useHandAndFingerUsage from "~/hooks/useHandAndFingerUsage.js";
import HeatmapComponent from "~/components/Heatmap.js";
import StatsComponent from "~/components/Stats.js";
import Dates from "~/components/Dates.js";
import { Keyboard } from "~/lib/api.js";
import dayjs from "dayjs";
import { KeymapUsage } from "keystats-common/dto/keyboard";

function getUsableLayers(layers: number[][][]): number[][][] {
  return layers.slice(0, 6);
}

function onlyDefined(layers: KeymapUsage): number[][][] {
  if (!layers) return [];
  return layers.map((l) => {
    if (!l) return [];

    return l.map((r) => {
      if (!r) return [];

      return r.map((c) => {
        return c || 0;
      });
    });
  });
}

function App() {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [keyboard, setKeyboard] = useState<Keyboard | null>(null);
  const [keyboards, loadingKeyboards, errorKeyboards /*, refreshKeyboards*/] =
    useKeyboards();
  const [keymaps, loadingKeymaps, errorKeymaps, refreshKeymaps] =
    useKeymaps(keyboard);
  const [characters, loadingCharacters, errorCharacters, refreshCharacters] =
    useCharacters(keyboard, date);
  const [counts, loadingCounts, errorCounts, refreshCounts] = useCounts(
    keyboard,
    date,
  );
  const [
    handAndFingerUsage,
    loadingHandAndFingerUsage,
    errorHandAndFingerUsage,
    refreshHandAndFingerUsage,
  ] = useHandAndFingerUsage(keyboard);
  const [dates, loadingDates, errorDates, refreshDates] = useDates(keyboard);

  const refreshAllData = useCallback(() => {
    refreshKeymaps();
    refreshCounts();
    refreshCharacters();
    refreshHandAndFingerUsage();
    refreshDates();
  }, [
    refreshCharacters,
    refreshCounts,
    refreshHandAndFingerUsage,
    refreshKeymaps,
    refreshDates,
  ]);

  const usableLayers = useMemo(() => {
    if (counts && counts.keymapUsage) {
      return getUsableLayers(onlyDefined(counts.keymapUsage));
    }
    return null;
  }, [counts]);

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
    loadingCharacters ||
    loadingDates;

  const error =
    errorKeyboards ||
    errorKeymaps ||
    errorCounts ||
    errorHandAndFingerUsage ||
    errorCharacters ||
    errorDates;

  return (
    <div className="App test">
      <header>
        {keyboard && keyboard.name && <h1>{keyboard.name}</h1>}
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {counts && !loading && (
          <button onClick={refreshAllData}>Refresh</button>
        )}
      </header>
      <div>
        {!loadingDates && dates && (
          <Dates dates={dates} selectedDate={date} onChange={setDate} />
        )}
      </div>
      <div className="content-container">
        <div className="layer-container">
          {counts && keymaps && (
            <ul>
              {usableLayers &&
                usableLayers.map((matrix, layerId) => {
                  if (matrix === null || matrix === undefined) return null;
                  if (!keymaps[layerId]) return null;
                  return (
                    <li key={layerId}>
                      <HeatmapComponent
                        data={onlyDefined(counts.keymapUsage)}
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
        {counts && (
          <div className="stats-container">
            <StatsComponent
              repetitions={handAndFingerUsage}
              totals={counts}
              characters={characters}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
