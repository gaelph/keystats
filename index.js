const HID = require("node-hid");
const usbDetect = require("usb-detection");
const fs = require("fs");

HID.setDriverType("libusb");

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

if (fs.existsSync("./log.json")) {
  let content = fs.readFileSync("./log.json");
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

function listenToDevice(device) {
  try {
    let hidDevice = new HID.HID(device.path);
    hidDevice.on("error", (error) => {
      console.error(error);
    });

    hidDevice.on("data", (data) => {
      const bytes = data.slice(0, data.length - 1);
      const [upperKeycode, lowerKeycode, col, row, pressed8, modbits, layer] =
        bytes;
      const keycode = (upperKeycode << 8) | lowerKeycode;
      const hexcode = keycode.toString(16);
      const pressed = pressed8 == 1;
      const modifiers = modbits.toString(16);

      if (pressed) {
        console.log(
          `RECEIVED: 0x${hexcode}, ${col}, ${row}, ${modifiers}, ${layer}`
        );
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
        const keycodeKey = `${hexcode}_${modifiers}`;
        if (!storage.codesPressed[keycodeKey]) {
          storage.codesPressed[keycodeKey] = {
            keycode: hexcode,
            modifiers: modifiers,
            count: 0,
            layer: layer,
          };
        }
        storage.codesPressed[keycodeKey].count += 1;

        fs.writeFile("./log.json", JSON.stringify(storage), {}, (err) => {
          if (err) console.error(err);
        });
      }
    });

    // hidDevice.setNonBlocking(1);

    hidDevice.resume();
    devices.push({
      usbDevice: device,
      hid: hidDevice,
    });
    console.log("Listening to plaid");
  } catch (error) {
    // silence
  }
}

async function listenPlaid() {
  let plaids = []

  while (plaids.length === 0) {
    plaids = HID.devices(VENDOR_ID, PRODUCT_ID).filter(
    (device) => device.usagePage === USAGE_PAGE && device.usage === USAGE
    );
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  if (plaids) {
    plaids.forEach((plaid) => listenToDevice(plaid));
  }
}

async function main() {
  usbDetect.startMonitoring();

  listenPlaid()

  usbDetect.on(`add:${VENDOR_ID}:${PRODUCT_ID}`, () => {
    console.log("Plaid connected");
    try {
      listenPlaid()
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
