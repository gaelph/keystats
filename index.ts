import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import url from "url";
import log from "loglevel";
// @ts-ignore
import loglevelPrefix from "loglevel-prefix";

// @ts-ignore
import * as k from "./client/src/lib/keycodes.js";
// @ts-ignore
import { getFingerForCoordinates } from "./client/src/lib/sums.js";

import HIDMessage from "./hid/HIDMessage.js";
import HIDEvent from "./hid/HIDEvent.js";
import HIDManager from "./hid/HIDManager.js";
import type HIDKeyboard from "./hid/HIDKeyboard.js";

loglevelPrefix(log);
log.setLevel(log.levels.TRACE);

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// File where the typing data is stored
const DATA_PATH = path.join(__dirname, "data", "log.json");
// File where the keymap information is stored
const LAYERS_PATH = path.join(__dirname, "data", "layers.json");

const VENDOR_ID = 5824;
const PRODUCT_ID = 10203;
const USAGE_PAGE = 0xff60;
const USAGE = 0x61;

function getAppName(): Promise<string> {
  return new Promise((resolve, reject) => {
    const appleScriptProcess = spawn("osascript", [
      path.join(__dirname, "AppName.scpt"),
    ]);

    appleScriptProcess.stdout.on("data", (output) => {
      const data = output.toString().trim();
      try {
        const response = JSON.parse(data);
        if (response.applicationName) {
          resolve(response.applicationName);
        } else {
          reject(new Error(response.error));
        }
      } catch (e) {
        reject(e);
      }
    });

    appleScriptProcess.stderr.on("data", (output) => {
      reject(new Error(output.toString()));
    });

    appleScriptProcess.on("close", (code) => {
      if (code !== 0) {
        log.debug("AppleScript process exited with code " + code);
      }
    });
  });
}

/**
 * @param {number} cols columns in the matrix
 * @param {number} rows rows in the matrix
 * @return {number[][]} the matrix initialized with 0
 */
function newMatrix(cols: number, rows: number): number[][] {
  const matrix: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}

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

interface PendingModTap {
  modifier: number;
  tapKeycode: number;
}

let modTapsPressed: PendingModTap[] = [];

function incrementKeycodeCount(keycode: number, mods: number, layer: number) {
  // Register more complete information about the keypress
  // to know how many times a given keycode was processed logically
  const keycodeKey = `${keycode.toString(16)}_${mods.toString(16)}`;
  if (!storage.codesPressed[keycodeKey]) {
    storage.codesPressed[keycodeKey] = {
      keycode: keycode.toString(16),
      modifiers: mods.toString(16),
      count: 0,
      layer: layer,
    };
  }
  storage.codesPressed[keycodeKey].count += 1;
}

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
  log.debug("FINGER", finger, row, col);
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
    log.debug(`Finger ${finger} used`);
    const previousFingerCount =
      storage.fingerUsage[lastFingerUsed][currentFingerCount] || 0;
    storage.fingerUsage[lastFingerUsed][currentFingerCount] =
      previousFingerCount + currentFingerCount;
    log.debug(
      `-- Previous finger ${lastFingerUsed} was used ${currentFingerCount} times`,
    );

    currentFingerCount = 1;
    lastFingerUsed = finger;
  } else {
    log.debug(`Same finger ${finger} ${currentFingerCount}`);
    currentFingerCount++;
  }
}

/**
 * Handles key event
 */
function handleHIDEvent(messages: HIDMessage[]) {
  const { keycode, col, row, mods, layer, pressed } = new HIDEvent(messages);

  getAppName()
    .then((appName) => log.debug("Application: " + appName))
    .catch((error) => log.error(error));

  // For the moment, we only care about keypresses
  if (pressed) {
    incrementHandCount(col < 6 ? "left" : "right");
    incrementFingerCount(row, col);

    if (storage.layers) {
      // Register the key presse in the matrix, regardless of the keycode
      // to know how many times a key was pressed on the physical device
      if (!storage.layers[layer]) {
        storage.layers[layer] = newMatrix(12, 4);
      }
      if (
        row >= storage.layers[layer].length ||
        col >= storage.layers[layer][row].length
      ) {
        // TODO: these are actually combos, we need a combo lookup
        // table
        log.warn("Invalid matrix coordinates", row, col, layer);
      } else {
        storage.layers[layer][row][col] += 1;
      }
    }

    // if it is modTap, we want to wait for its release before counting it
    if (k.isModTap(keycode)) {
      const modifier = k.getModifierFromModTap(keycode);
      const tapKeycode = k.getBasicFromModTap(keycode);
      modTapsPressed.push({
        modifier,
        tapKeycode,
      });
      log.debug(
        "MOD TAP PRESS: ",
        modifier.toString(16),
        tapKeycode.toString(16),
      );
    }
    // any other key, we increment
    else {
      incrementKeycodeCount(keycode, mods, layer);

      if (mods !== 0) {
        const pressedModifiers = k.getModifiersFromModsBitfield(mods);
        // remove mod taps that have been used as modifiers
        // so that we don't count them twice
        modTapsPressed = modTapsPressed.filter(
          ({ modifier }) => !pressedModifiers.includes(modifier),
        );
      }
    }

    // Finally write all this to disk
  } else {
    if (k.isModTap(keycode)) {
      const released = k.getBasicFromModTap(keycode);
      const tapModifier = k.getModifierFromModTap(keycode);

      log.debug(
        "MOD TAP RELEASE: ",
        released.toString(16),
        tapModifier.toString(16),
      );

      // The mod tap key was pressed alone, so it is the basic keycode
      // we are interested in
      if (modTapsPressed.some(({ tapKeycode }) => tapKeycode == released)) {
        incrementKeycodeCount(
          released,
          // ensure we don't count it as Mod+letter combination
          k.removeModifierFromBitfield(mods, tapModifier),
          layer,
        );
        log.debug("COUNT A SINGLE KEY: ", released.toString(16));
      }

      // Remove the mod tap key from the list
      modTapsPressed = modTapsPressed.filter(
        ({ tapKeycode }) => tapKeycode == released,
      );
    }
  }
  fs.writeFile(DATA_PATH, JSON.stringify(storage), {}, (err) => {
    if (err) log.error(err);
  });
}

async function main() {
  const manager = new HIDManager([
    {
      vendorId: VENDOR_ID,
      productId: PRODUCT_ID,
      usagePage: USAGE_PAGE,
      usage: USAGE,
    },
  ]);

  process.on("SIGINT", () => {
    manager.disconnect();
    process.exit(0);
  });

  // Blocking call, tries to connect to keyboard
  // or wait for one to connect
  manager
    .connect()
    .on("keyboard", async (keyboard: HIDKeyboard) => {
      keyboard.on("event", (messages: HIDMessage[]) => {
        handleHIDEvent(messages);
      });

      // Read the layers from the keyboard
      const layers = await keyboard.getLayers();

      // Save them
      fs.writeFile(LAYERS_PATH, JSON.stringify(layers), (err) => {
        if (err) {
          log.error(err);
        }
      });
    })
    .on("error", (error) => {
      log.error(error);
    });
}

main();
