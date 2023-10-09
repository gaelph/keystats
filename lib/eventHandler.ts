import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import url from "url";
import log from "loglevel";
// @ts-ignore

// @ts-ignore
import * as k from "../client/src/lib/keycodes.js";
// @ts-ignore
import { getFingerForCoordinates } from "../client/src/lib/sums.js";

import * as Keycodes from "../lib/keycodes.js";

import HIDEvent from "../hid/HIDEvent.js";
import { KeymapType } from "../service/models/keymap.js";

const __dirname = url.fileURLToPath(new URL("..", import.meta.url));
// File where the typing data is stored
const DATA_PATH = path.join(__dirname, "data", "log.json");

interface CodePressed {
  keycode: string;
  modifiers: string;
  count: number;
  layer: number;
}

// Volatile storage for typing data collection
interface Storage {
  layers: number[][][];
  codesPressed: Record<string, CodePressed>;
  handUsage: Record<string, number>[];
  fingerUsage: Record<string, number>[];
}

let storage: Storage = {
  layers: [],
  codesPressed: {},
  handUsage: [{}, {}],
  fingerUsage: new Array(10).fill(0),
};

// Create the data collection file if it does not exist
// or load its content if it does
if (fs.existsSync(DATA_PATH)) {
  const content = fs.readFileSync(DATA_PATH).toString("utf-8");
  storage = JSON.parse(content);
  if (!storage.handUsage) {
    storage.handUsage = [{}, {}];
  }
  if (!storage.fingerUsage) {
    storage.fingerUsage = new Array(10);
  }
}

// List of USB/HID devices

let currentLeftHandCount = 0;
let currentRightHandCount = 0;
let lastHandUsed: null | "left" | "right" = null;

function incrementHandCount(hand: "left" | "right") {
  if (hand == "left") {
    currentLeftHandCount += 1;
    if (lastHandUsed === "right") {
      const previousRightHandCount =
        storage.handUsage[1][currentRightHandCount] || 0;
      storage.handUsage[1][currentRightHandCount] =
        previousRightHandCount + currentRightHandCount;
    }
    currentRightHandCount = 0;
    lastHandUsed = hand;
  } else {
    currentRightHandCount += 1;
    if (lastHandUsed === "left") {
      const previousLeftHandCount =
        storage.handUsage[0][currentLeftHandCount] || 0;
      storage.handUsage[0][currentLeftHandCount] =
        previousLeftHandCount + currentLeftHandCount;
    }
    currentLeftHandCount = 0;
    lastHandUsed = "right";
  }
}

let currentFingerCount = 0;
let lastFingerUsed = -1;

function incrementFingerCount(row: number, col: number) {
  const finger = getFingerForCoordinates(row, col);
  // log.debug("FINGER", finger, row, col);
  if (finger === null) return;

  if (
    !storage.fingerUsage[lastFingerUsed] ||
    typeof storage.fingerUsage[lastFingerUsed] !== "object"
  ) {
    storage.fingerUsage[lastFingerUsed] = {};
  }

  if (
    !storage.fingerUsage[finger] ||
    typeof storage.fingerUsage[lastFingerUsed] !== "object"
  ) {
    storage.fingerUsage[finger] = {};
  }

  if (finger !== lastFingerUsed) {
    // log.debug(`Finger ${finger} used`);
    const previousFingerCount =
      storage.fingerUsage[lastFingerUsed][currentFingerCount] || 0;
    storage.fingerUsage[lastFingerUsed][currentFingerCount] =
      previousFingerCount + currentFingerCount;
    // log.debug(
    //   `-- Previous finger ${lastFingerUsed} was used ${currentFingerCount} times`,
    // );

    currentFingerCount = 1;
    lastFingerUsed = finger;
  } else {
    // log.debug(`Same finger ${finger} ${currentFingerCount}`);
    currentFingerCount++;
  }
}

interface KeyDown {
  keycode: number;
  mods: number;
  col: number;
  row: number;
  layer: number;
  since: number;
}

const TAP_TERM = 250; // milliseconds

/**
 * Handles key event
 */
export default class KeyHandler extends EventEmitter {
  #logger = log.getLogger("KeyHandler");
  #keysDown: KeyDown[] = [];
  #currentLeftHandCount = 0;
  #currentRightHandCount = 0;
  #lastHandUsed: null | "left" | "right" = null;
  #currentFingerCount = 0;
  #lastFingerUsed = -1;

  constructor() {
    super();

    // this.#logger.disableAll();
  }

  emitPlain(
    keycode: number,
    mods: number,
    col: number,
    row: number,
    layer: number,
  ) {
    const [base, _type, _alter] = Keycodes.getEncodedKeycode(
      keycode.toString(16),
    );

    this.emit("key", {
      keycode: base,
      mods,
      col,
      row,
      layer,
      type: KeymapType.Plain,
    });
  }

  emitNonPlain(keycode: number, col: number, row: number, layer: number) {
    const [_base, type, alter] = Keycodes.getEncodedKeycode(
      keycode.toString(16),
    );

    this.emit("key", {
      keycode: alter,
      type,
      col,
      row,
      layer,
    });
  }

  handleHIDEvent(event: HIDEvent) {
    const { keycode, col, row, mods, layer, pressed } = event;

    // For the moment, we only care about keypresses
    if (pressed) {
      this.#keysDown.push({
        keycode,
        mods,
        col,
        row,
        layer,
        since: performance.now(),
      });

      this.#logger.debug(
        `KEY PRESS: ${keycode.toString(16)} | ${mods.toString(
          16,
        )} | col ${col} | row ${row} | layer ${layer} | keys down: ${
          this.#keysDown.length
        } `,
      );

      incrementHandCount(col < 6 ? "left" : "right");
      incrementFingerCount(row, col);
      // Finally write all this to disk
    } else {
      const idx = this.#keysDown.findIndex(
        ({ keycode }) => keycode === keycode,
      );
      const pressedState = this.#keysDown[idx];
      this.#keysDown.splice(idx, 1);

      let timePressed = 249;
      if (pressedState) {
        timePressed = performance.now() - pressedState.since;
      } else {
        this.#logger.warn("Key not found", keycode.toString(16), mods, layer);
      }

      this.#logger.debug(
        `KEY RELEASE: ${keycode.toString(16)} | ${mods.toString(
          16,
        )} | mods ${mods.toString(
          2,
        )} | col ${col} | row ${row} | layer ${layer} ${
          pressedState.layer
        } | keys down: ${
          this.#keysDown.length
        } | time pressed: ${timePressed} ms`,
      );

      // if it is modTap, we want to wait for its release before counting it
      if (
        k.isModTap(keycode) &&
        !k.isLayerTap(keycode) &&
        !k.isCustomKeycode(keycode)
      ) {
        const released = k.getBasicFromModTap(keycode);
        const tapModifier = k.getModifierFromModTap(keycode);

        this.#logger.debug(
          "MOD TAP RELEASE: ",
          tapModifier.toString(16),
          released.toString(16),
        );

        // The mod tap key was pressed alone, so it is the basic keycode
        // we are interested in
        if (timePressed < TAP_TERM) {
          this.emitPlain(
            released,
            // ensure we don't count it as Mod+letter combination
            k.removeModifierFromBitfield(mods, tapModifier),
            col,
            row,
            layer,
          );

          this.#logger.debug(
            "COUNT A SINGLE KEY: ",
            mods.toString(2).padStart(8, "0"),
            released.toString(16),
          );
        } else {
          this.emitNonPlain(keycode, col, row, layer);
        }
      } else if (k.isLayerTap(keycode) && !k.isCustomKeycode(keycode)) {
        const released = k.getBasicFromModTap(keycode);
        const tapLayer = k.getLayerFromLayerTap(keycode);

        this.#logger.debug(
          "LAYER TAP RELEASE: ",
          tapLayer.toString(10),
          released.toString(16),
        );

        if (timePressed < TAP_TERM) {
          this.emitPlain(keycode, mods, col, row, pressedState.layer);
          this.#logger.debug(
            "COUNT A SINGLE KEY: ",
            released.toString(16),
            mods.toString(2).padStart(8, "0"),
            pressedState.layer,
          );
        } else {
          this.emitNonPlain(keycode, col, row, tapLayer);
        }
      } else {
        this.emitPlain(keycode, mods, col, row, layer);
      }
    }
    fs.writeFile(DATA_PATH, JSON.stringify(storage), {}, (err) => {
      if (err) this.#logger.error(err);
    });
  }
}
