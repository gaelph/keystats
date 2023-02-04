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

let storage = {
  matrix: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  codesPressed: {},
};

if (fs.existsSync("./log.json")) {
  let content = fs.readFileSync("./log.json");
  storage = JSON.parse(content);
  console.log(storage);
}

let devices = [];
let listen = true;

process.on("SIGINT", () => {
  console.log("should abort !!!!");
  listen = false;
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
      const [upperKeycode, lowerKeycode, col, row, pressed8, mods] = bytes;
      const keycode = (upperKeycode << 8) | lowerKeycode;
      const pressed = pressed8 == 1;

      if (pressed) {
        if (
          storage.matrix &&
          storage.matrix[row] !== undefined &&
          storage.matrix[row][col] !== undefined
        ) {
          storage.matrix[row][col] += 1;
        } else {
          console.warn("invalid matrix coordinates", row, col);
        }
        if (!storage.codesPressed[keycode]) {
          storage.codesPressed[keycode] = 0;
        }
        storage.codesPressed[keycode] = storage.codesPressed[keycode] + 1;

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

async function main() {
  usbDetect.startMonitoring();

  let plaids = HID.devices(VENDOR_ID, PRODUCT_ID).filter(
    (device) => device.usagePage === USAGE_PAGE && device.usage === USAGE
  );

  if (plaids) {
    plaids.forEach((plaid) => listenToDevice(plaid));
  }

  usbDetect.on(`add:${VENDOR_ID}:${PRODUCT_ID}`, (device) => {
    try {
      let plaid = HID.devices(device.vendorId, device.productId).find(
        (device) => device.usagePage === USAGE_PAGE && device.usage === USAGE
      );

      if (plaid) {
        listenToDevice(plaid);
      }
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
