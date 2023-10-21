import Config from "./config/Config.js";
import logger from "./lib/logger.js";
import HIDManager from "./hid/HIDManager.js";
import startServer from "./server/index.js";

import KeyboardService from "./service/keyboardService.js";

import type HIDKeyboard from "./hid/HIDKeyboard.js";
import { initializeDB } from "./service/database.js";

const log = logger.getLogger();

async function main() {
  const config = await new Config().load();
  await initializeDB();

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

  startServer();

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
    .on("error", (error: unknown) => {
      log.error(error);
    });
}

main();
