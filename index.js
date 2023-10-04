// @ts-check
import HID from "node-hid";
import usbDetect from "usb-detection";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import url from "url";
import { HIDMessage } from "./hid/message.js";
import {
  HID_CMD_GET_LAYERS,
  HID_CMD_GET_LAYERS_METADATA,
  HID_CMD_UNKNOWN,
  HID_EVENT,
} from "./hid/constants.js";
import { HIDEvent } from "./hid/HIDEvent.js";
import {
  CmdGetLayersMetadata,
  CmdGetLayersMetadataResponse,
} from "./hid/CmdGetLayersMetadata.js";
import { CmdGetLayers, CmdGetLayersResponse } from "./hid/CmdGetLayers.js";

import * as k from "./client/src/lib/keycodes.js";
import { getFingerForCoordinates } from "./client/src/lib/sums.js";

import log from "loglevel";
import loglevelPrefix from "loglevel-prefix";

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

function getAppName() {
  return new Promise((resolve, reject) => {
    const appleScriptProcess = spawn("osascript", [`AppName.scpt`]);

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
function newMatrix(cols, rows) {
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}

// Volatile storage for typing data collection
/** @typedef {Object} Storage
 * @property {number[][][]} Storage.layers
 * @property {Object<string, Object>} Storage.codesPressed
 * @property {Object<number, number>[]} Storage.handUsage
 * @property {Object<number, number>[]} Storage.fingerUsage
 */
/** @type {Storage} */
let storage = {
  layers: [],
  codesPressed: {},
  handUsage: [{}, {}],
  fingerUsage: new Array(10).fill(0),
};

// Create the data collection file if it does not exist
// or load its content if it does
if (fs.existsSync(DATA_PATH)) {
  let content = fs.readFileSync(DATA_PATH).toString("utf-8");
  storage = JSON.parse(content);
  if (!storage.handUsage) {
    storage.handUsage = [{}, {}];
  }
  if (!storage.fingerUsage) {
    storage.fingerUsage = new Array(10);
  }
}

// List of USB/HID devices

/** @typedef {{hid: HID.HID, usbDevice: {vendorId: number, productId: number}}} Device
 * The `hid` object comes from `node-hid`
 * and the `usbDevice` one comes from `usb-detection`
 */
/** @type {Device[]} */
let devices = [];

// Process exist handling
process.on("SIGINT", () => {
  log.debug("should abort !!!!");
  // All handles to HID devices should be closed
  devices.forEach((device) => {
    device.hid.close();
  });
  devices = [];
  // allow the process to exit normally
  usbDetect.stopMonitoring();
  process.exit(0);
});

/** @typedef {{ modifier: string, tapKeycode: string }} PendingModTap */
/* @var {PendingModTap[]} modTapsPressed */
let modTapsPressed = [];

function incrementKeycodeCount(keycode, mods, layer) {
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
/** @type {null|"left"|"right"} */
let lastHandUsed = null;

function incrementHandCount(hand) {
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

function incrementFingerCount(row, col) {
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
 * @param {HIDMessage[]} messages
 */
function handeHIDEvent(messages) {
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

// Layer information handling

/** @type {number} */
let numberOfLayers;
/** @type {number} */
let matrixRows;
/** @type {number} */
let matrixCols;

/**
 * Handles the reception of Layer and matrices metadata,
 * i.e. number of layers and matrix dimensions.
 *
 * @param {HID.HID} hidDevice
 * @param {HIDMessage[]} messages
 */
function handleLayerMetadata(hidDevice, messages) {
  log.debug("Received Layer Metadata :", messages.length, "messages");
  // @ts-ignore
  const metadata = new CmdGetLayersMetadataResponse(messages);
  numberOfLayers = metadata.nLayers;
  matrixCols = metadata.cols;
  matrixRows = metadata.rows;
  log.debug(
    `layers: ${numberOfLayers} | matrix dimensions: ${matrixRows}x${matrixCols}`,
  );

  // Now that we have matrices parameters, let’s get keymapping
  getLayerData(hidDevice);
}

/**
 * Handles the reception of keymaps
 * @param {import("node-hid").HID} hidDevice
 * @param {HIDMessage[]} messages
 */
function handleLayerData(hidDevice, messages) {
  log.debug("Received Layer Data :", messages.length, "messages");
  if (!numberOfLayers || !matrixRows || !matrixCols) {
    throw new Error(
      "No matrix metadata, make sure you called getLayerMetadata first",
    );
  }
  const layerData = new CmdGetLayersResponse(messages);
  const layers = layerData.getLayers(numberOfLayers, matrixRows, matrixCols);

  fs.writeFile(LAYERS_PATH, JSON.stringify(layers), (err) => {
    if (err) {
      log.error(err);
    }
  });
}

/**
 * Call ids are used to identify responses after writing a command to the device
 */
let currentCallId = 0;
const MAX_CALL_ID = 0xffff;

/**
 * Returns the next available `callId`. Since call ids are 16-bit integers,
 * when reaching the highest value, we go back to 0.
 * This allows for 65536 simultaneous calls. Overkill
 * @returns {number}
 */
function nextCallId() {
  if (currentCallId == MAX_CALL_ID) {
    currentCallId = 0;
  } else {
    currentCallId++;
  }

  return currentCallId;
}

/**
 * An async function that waits for n milliseconds
 * @param {number} n Milliseconds to wait for
 * @returns {Promise<void>}
 */
function wait(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), n);
  });
}

/**
 * Sends a command to the device to retrieve the number of layers
 * and matrix dimensions
 * @param {HID.HID} hidDevice
 * @returns {Promise<void>}
 */
async function getLayerMetadata(hidDevice) {
  log.debug("Getting device layer metadata");
  const command = new CmdGetLayersMetadata(nextCallId());
  let msgWritten = 0;
  let bytesWritten = 0;
  const mess = command.toHIDMessages();
  for (let message of mess) {
    await wait(100);

    try {
      // @ts-ignore | the function does exist
      bytesWritten += hidDevice.write(message.serialize());
    } catch (err) {
      log.error(err);
      return;
    }

    await wait(100);
    msgWritten += 1;
  }

  log.debug(msgWritten, "messages sent |", bytesWritten, "bytes written");
}

/**
 * Sends a command to the device to retrieve the keymap
 * @param {HID.HID} hidDevice
 * @returns {Promise<void>}
 */
async function getLayerData(hidDevice) {
  log.debug("Getting device layer data");
  const command = new CmdGetLayers(nextCallId());
  let msgWritten = 0;
  let bytesWritten = 0;

  for (let message of command.toHIDMessages()) {
    await wait(100);

    try {
      // @ts-ignore | the function does exist
      bytesWritten += hidDevice.write(message.serialize());
    } catch (err) {
      log.error(err);
      return;
    }
    msgWritten += 1;
    await wait(100);
  }

  log.debug(msgWritten, "messages sent |", bytesWritten, "bytes written");
}

/**
 * Start listening for events on the device,
 * and sends commands to retrieve layers and keymap information
 * @param {Object} device   A device object from `usb-detection`
 */
function listenToDevice(device) {
  log.log("Listening to device");
  try {
    let hidDevice = new HID.HID(device.path);
    hidDevice.on("error", (error) => {
      log.error(error);
    });

    // The pool is used to store series of messages belonging to the same
    // call response, identified by the command by and the call_id
    /** @type {Object<string, HIDMessage[]>} */
    const messagePool = {};

    hidDevice.on(
      "data",
      /** @param {Uint8Array} data */
      (data) => {
        try {
          const message = new HIDMessage(data);

          // store the message in the message pool
          const poolKey = `${message.cmd}_${message.callId}`;
          if (!messagePool[poolKey]) {
            messagePool[poolKey] = [];
          }
          messagePool[poolKey].push(message);

          // when all messages for the same call response have been received
          if (messagePool[poolKey].length == message.totalPackets) {
            // handle the message
            switch (message.cmd) {
              case HID_EVENT:
                handeHIDEvent(messagePool[poolKey]);
                break;
              case HID_CMD_GET_LAYERS:
                handleLayerData(hidDevice, messagePool[poolKey]);
                break;
              case HID_CMD_GET_LAYERS_METADATA:
                handleLayerMetadata(hidDevice, messagePool[poolKey]);
                break;
              case HID_CMD_UNKNOWN:
              default:
                log.warn("unknown command", message.cmd, message.callId);
                break;
            }
            // remove from the pool when done
            delete messagePool[poolKey];
          }
        } catch (error) {
          log.error(error);
        }
      },
    );

    // Ensure the device is being listened to
    hidDevice.resume();

    // Register the device so that we can stop listening to it
    devices.push({
      usbDevice: device,
      hid: hidDevice,
    });
    log.log("Listening to plaid");

    // Get matrix and keymaps
    getLayerMetadata(hidDevice);
  } catch (error) {
    // silence
  }
}

// Start to listen to a Plaid Keyboard
async function listenPlaid() {
  let plaids = [];

  while (plaids.length === 0) {
    plaids = HID.devices(VENDOR_ID, PRODUCT_ID).filter(
      (device) => device.usagePage === USAGE_PAGE && device.usage === USAGE,
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (plaids) {
    plaids.forEach((plaid) => listenToDevice(plaid));
  }

  return plaids.length != 0;
}

async function main() {
  usbDetect.startMonitoring();

  log.log("Waiting for Plaid Keyboard");
  listenPlaid();

  usbDetect.on(`add:${VENDOR_ID}:${PRODUCT_ID}`, () => {
    log.log("Plaid connected");
    try {
      listenPlaid();
    } catch (error) {
      log.error(error);
    }
  });

  usbDetect.on(`remove:${VENDOR_ID}:${PRODUCT_ID}`, (disconnectedDevice) => {
    log.log("Plaid disconnected");
    devices.forEach(({ usbDevice, hid }) => {
      if (
        usbDevice.vendorId === disconnectedDevice.vendorId &&
        usbDevice.productId === disconnectedDevice.productId
      ) {
        hid.close();
      }
    });

    devices = [];
  });
}

main();
