import { EventEmitter } from "events";
import HID from "node-hid";
import usbDetect from "usb-detection";
import log from "loglevel";

import type { DeviceConfig } from "../config/Config.js";
import HIDKeyboard from "./HIDKeyboard.js";

/**
 * The `hid` object comes from `node-hid`
 * and the `usbDevice` one comes from `usb-detection`
 */
interface Device {
  usbDevice: {
    vendorId: number;
    productId: number;
  };
}

/**
 * Establishes connection to a HID device.
 * Writes commands, emits events.
 */
export default class HIDManager extends EventEmitter {
  confs: DeviceConfig[];
  devices: Device[] = [];
  keyboards: HIDKeyboard[] = [];
  logger = log.getLogger("HIDManager");

  constructor(init: DeviceConfig[]) {
    super();

    this.confs = init;
  }

  /**
   * @private
   * Sets up listners to receive messages from the HID device.
   */
  private _listen(device: HID.Device, deviceConfig: DeviceConfig) {
    this.logger.info("Attaching device", deviceConfig.name);
    try {
      // @ts-expect-error | device.path might be undefined
      const hidDevice = new HID.HID(device.path) as HID.HID;
      const keyboard = new HIDKeyboard(hidDevice, deviceConfig);

      // Register the device so that we can stop listening to it
      this.devices.push({
        usbDevice: device,
      });

      this.keyboards.push(keyboard);

      this.logger.info(`Device ${deviceConfig.name} attached`);

      this.emit("keyboard", keyboard);
    } catch (error) {
      this.logger.error(`Error attaching device ${deviceConfig.name}:`, error);
      // silence
    }
  }

  /**
   * Waits for a device to be attached, and starts listening to it
   */
  private async _attach(conf: DeviceConfig): Promise<boolean> {
    let hidDevices: HID.Device[] = [];

    while (hidDevices.length === 0) {
      hidDevices = HID.devices(conf.vendorId, conf.productId).filter(
        (device) =>
          device.usagePage === conf.usagePage && device.usage === conf.usage,
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (hidDevices) {
      hidDevices.forEach((hidDevice) => this._listen(hidDevice, conf));
    }

    return hidDevices.length != 0;
  }

  /**
   * Disconnects from the all the connected devices and stops monitoring
   * USB connections, effectively halting the program.
   */
  disconnect() {
    this.logger.info("Disconnecting Devices");
    this.keyboards.forEach((device) => {
      this.emit("disconnect", device);
      device.close();
    });
    this.devices = [];

    usbDetect.stopMonitoring();
  }

  /**
   * Initiates connection to devices.
   * Waits for a device to be detected, attaches to it, and starts listening to it.
   * The returned promise resolves to the HIDKeyboard instance, which is
   * a high level interface to interact with the device.
   */
  connect(): HIDManager {
    usbDetect.startMonitoring();

    for (const conf of this.confs) {
      this.logger.info("Waiting for Keyboard");
      this._attach(conf);

      usbDetect.on(`add:${conf.vendorId}:${conf.productId}`, () => {
        this.logger.info("Device connected", conf.vendorId, conf.productId);

        try {
          this._attach(conf);
        } catch (error) {
          this.emit("error", error);
        }
      });

      usbDetect.on(
        `remove:${conf.vendorId}:${conf.productId}`,
        (disconnectedDevice) => {
          this.logger.info(
            "Device disconnected",
            conf.vendorId,
            conf.productId,
          );
          this.keyboards.forEach((keyboard) => {
            this.emit("disconnect", keyboard);
            if (keyboard.is(disconnectedDevice)) {
              keyboard.close();
            }
          });

          this.devices = [];
          this.keyboards = [];
        },
      );
    }

    return this;
  }
}
