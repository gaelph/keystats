import log from "loglevel";
// @ts-ignore
import logPrefix from "loglevel-plugin-prefix";
import Config from "./config/Config.js";
import HIDManager from "./hid/HIDManager.js";

import KeyboardService from "./service/keyboardService.js";

import type HIDKeyboard from "./hid/HIDKeyboard.js";

logPrefix.reg(log);
logPrefix.apply(log, {
  template: "%n [%t]: %l:",
});
log.setLevel(log.levels.TRACE);

async function main() {
  const config = await new Config().load();

  const manager = new HIDManager(config.devices);
  const keyboardService = new KeyboardService();

  process
    .on("SIGINT", () => {
      manager.disconnect();
      process.exit(0);
    })
    .on("uncaughtException", (err: unknown) => {
      log.error(err);
    })
    .on("unhandledRejection", (err: unknown) => {
      log.error(err);
    });

  // Blocking call, tries to connect to keyboard
  // or wait for one to connect
  manager
    .connect()
    .on("keyboard", async (keyboard: HIDKeyboard) => {
      keyboardService.handleKeyboard(keyboard);
    })
    .on("disconnect", (keyboard: HIDKeyboard) => {
      keyboardService.stop(keyboard);
    })
    .on("error", (error) => {
      log.error(error);
    });
}

main();
