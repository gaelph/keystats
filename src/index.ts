import log, { LogLevelDesc } from "loglevel";
// @ts-ignore
import logPrefix from "loglevel-plugin-prefix";
import Config from "./config/Config.js";
import HIDManager from "./hid/HIDManager.js";

import KeyboardService from "./service/keyboardService.js";

import type HIDKeyboard from "./hid/HIDKeyboard.js";
import { initializeDB } from "./service/database.js";

logPrefix.reg(log);
logPrefix.apply(log, {
  template: "%n [%t]: %l:",
});

// TODO: move to config
function isLogLevel(level: string): level is keyof typeof log.levels {
  return level in log.levels;
}

// TODO: move to config
function getLogLevel(): LogLevelDesc {
  const level: string | undefined = process.env.LOG_LEVEL;
  if (level && isLogLevel(level)) {
    return log.levels[level as keyof typeof log.levels];
  } else {
    return log.levels.INFO;
  }
}

// TODO: move to config
log.setLevel(getLogLevel());

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
