const HID = require("node-hid");
const usbDetect = require("usb-detection");
const fs = require("fs");
const path = require("path");
const HIDMessage = require("./hid/message");
const {
  HID_CMD_GET_LAYERS,
  HID_CMD_GET_LAYERS_METADATA,
  HID_CMD_UNKNOWN,
  HID_EVENT,
} = require("./hid/constants");
const HIDEvent = require("./hid/HIDEvent");
const {
  CmdGetLayersMetadata,
  CmdGetLayersMetadataResponse,
} = require("./hid/CmdGetLayersMetadata");
const { CmdGetLayers, CmdGetLayersResponse } = require("./hid/CmdGetLayers");

const DATA_PATH = path.join(__dirname, "data", "log.json");
const LAYERS_PATH = path.join(__dirname, "data", "layers.json");

// HID.setDriverType("libusb");

const VENDOR_ID = 5824;
const PRODUCT_ID = 10203;
const USAGE_PAGE = 0xff60;
const USAGE = 0x61;
const LCTRL = 0xe0;
const LSHFT = 0xe1;
const LALT = 0xe2;
const LGUI = 0xe3;
const RCTRL = 0xe4;
const RSHFT = 0xe5;
const RALT = 0xe6;
const RGUI = 0xe7;

function isMod(code, mod) {
  return code & (mod == mod);
}

/**
 * @param {number} cols columns in the matrix
 * @param {number} rows rows in the matrix
 * @return {Array} the matrix initialized with 0
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

let storage = {
  layers: [],
  codesPressed: {},
};

if (fs.existsSync(DATA_PATH)) {
  let content = fs.readFileSync(DATA_PATH);
  storage = JSON.parse(content);
  console.log(storage);
}

let devices = [];

process.on("SIGINT", () => {
  console.log("should abort !!!!");
  devices.forEach((device) => {
    device.hid.close();
  });
  devices = [];
  usbDetect.stopMonitoring();
  process.exit(0);
});

function handeHIDEvent(messages) {
  const { keycode, col, row, mods, layer, pressed } = new HIDEvent(messages);
  if (pressed) {
    if (storage.layers) {
      if (!storage.layers[layer]) {
        storage.layers[layer] = newMatrix(12, 4);
      }
      if (
        row >= storage.layers[layer].length ||
        col >= storage.layers[layer][row].length
      ) {
        console.log("Invalid matrix coordinates", row, col, layer);
      } else {
        storage.layers[layer][row][col] += 1;
      }
    }
    const keycodeKey = `${keycode}_${mods}`;
    if (!storage.codesPressed[keycodeKey]) {
      storage.codesPressed[keycodeKey] = {
        keycode: keycode,
        modifiers: mods,
        count: 0,
        layer: layer,
      };
    }
    storage.codesPressed[keycodeKey].count += 1;

    fs.writeFile(DATA_PATH, JSON.stringify(storage), {}, (err) => {
      if (err) console.error(err);
    });
  }
}

let numberOfLayers, matrixRows, matrixCols;
function handleLayerMetadata(hidDevice, messages) {
  console.log("Received Layer Metadata :", messages.length, "messages");
  const metadata = new CmdGetLayersMetadataResponse(messages);
  numberOfLayers = metadata.nLayers;
  matrixCols = metadata.cols;
  matrixRows = metadata.rows;
  console.log(
    `layers: ${numberOfLayers} | matrix dimensions: ${matrixRows}x${matrixCols}`
  );

  getLayerData(hidDevice);
}

function handleLayerData(hidDevice, messages) {
  console.log("Received Layer Data :", messages.length, "messages");
  if (!numberOfLayers || !matrixRows || !matrixCols) {
    throw new Error(
      "No matrix metadata, make sure you called getLayerMetadata first"
    );
  }
  const layerData = new CmdGetLayersResponse(messages);
  const layers = layerData.getLayers(numberOfLayers, matrixRows, matrixCols);

  fs.writeFile(LAYERS_PATH, JSON.stringify(layers), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

let currentCallId = 0;
const MAX_CALL_ID = 0xffff;
function nextCallId() {
  if (currentCallId == MAX_CALL_ID) {
    currentCallId = 0;
  } else {
    currentCallId++;
  }

  return currentCallId;
}

// an async function that waits for n milliseconds
function wait(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), n);
  });
}

async function getLayerMetadata(hidDevice) {
  console.log("Getting device layer metadata");
  const command = new CmdGetLayersMetadata(nextCallId());
  let msgWritten = 0;
  let bytesWritten = 0;
  const mess = command.toHIDMessages();
  for (let message of mess) {
    await wait(100);

    const msgbytes = Array.from(message.serialize());
    msgbytes.push(1);
    bytesWritten += hidDevice.write(msgbytes);

    await wait(100);
    msgWritten += 1;
  }

  console.log(msgWritten, "messages sent |", bytesWritten, "bytes written");
}

async function getLayerData(hidDevice) {
  console.log("Getting device layer data");
  const command = new CmdGetLayers(nextCallId());
  let msgWritten = 0;
  let bytesWritten = 0;

  for (let message of command.toHIDMessages()) {
    await wait(100);
    const msgBytes = Array.from(message.serialize());
    msgBytes.push(1);
    bytesWritten += hidDevice.write(msgBytes);
    msgWritten += 1;
    await wait(100);
  }

  console.log(msgWritten, "messages sent |", bytesWritten, "bytes written");
}

function listenToDevice(device) {
  try {
    let hidDevice = new HID.HID(device.path);
    hidDevice.on("error", (error) => {
      console.error(error);
    });

    const messagePool = {};

    hidDevice.on("data", (data) => {
      const message = new HIDMessage(data);
      const poolKey = `${message.cmd}_${message.callId}`;
      if (!messagePool[poolKey]) {
        messagePool[poolKey] = [];
      }
      messagePool[poolKey].push(message);
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
            console.log("unknown command", message.cmd, message.callId);
            break;
        }
        // remove from the pool when done
        delete messagePool[poolKey];
      }
    });

    // hidDevice.setNonBlocking(1);

    hidDevice.resume();
    devices.push({
      usbDevice: device,
      hid: hidDevice,
    });
    console.log("Listening to plaid");
    getLayerMetadata(hidDevice);
  } catch (error) {
    // silence
  }
}

async function listenPlaid() {
  let plaids = [];

  while (plaids.length === 0) {
    plaids = HID.devices(VENDOR_ID, PRODUCT_ID).filter(
      (device) => device.usagePage === USAGE_PAGE && device.usage === USAGE
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (plaids) {
    plaids.forEach((plaid) => listenToDevice(plaid));
  }
}

async function main() {
  usbDetect.startMonitoring();

  listenPlaid();

  usbDetect.on(`add:${VENDOR_ID}:${PRODUCT_ID}`, () => {
    console.log("Plaid connected");
    try {
      listenPlaid();
    } catch (error) {
      console.log(error);
    }
  });

  usbDetect.on(`remove:${VENDOR_ID}:${PRODUCT_ID}`, (disconnectedDevice) => {
    console.log("Plaid disconnected");
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
