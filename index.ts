import log from "loglevel";
// @ts-ignore
import logPrefix from "loglevel-plugin-prefix";
import Config from "./config/Config.js";
import HIDManager from "./hid/HIDManager.js";

import db from "./service/database.js";
import KeyboardRepo from "./service/repository/keyboardRepo.js";
import KeysRepo from "./service/repository/keysRepo.js";
import LayerRepo from "./service/repository/layerRepo.js";
import RecordRepo from "./service/repository/recordRepo.js";
import KeyboardService from "./service/keyboardService.js";

import KeyHandler from "./lib/eventHandler.js";

import type HIDKeyboard from "./hid/HIDKeyboard.js";
import RecordService from "./service/recordService.js";
import HandService from "./service/handService.js";
import HandUsageRepo from "./service/repository/handUsagerRepo.js";
import FingerService from "./service/fingerService.js";
import FingerUsageRepo from "./service/repository/fingerUsageRepo.js";

logPrefix.reg(log);
logPrefix.apply(log, {
  template: "%n [%t]: %l:",
});
log.setLevel(log.levels.TRACE);

async function main() {
  const config = await new Config().load();

  const manager = new HIDManager(config.devices);
  const keyboardService = new KeyboardService(
    new KeyboardRepo(db),
    new LayerRepo(db),
    new KeysRepo(db),
    new RecordService(new RecordRepo(db)),
    new HandService(new HandUsageRepo(db), new KeysRepo(db)),
    new FingerService(new FingerUsageRepo(db), new KeysRepo(db)),
    new KeyHandler(),
  );

  process.on("SIGINT", () => {
    manager.disconnect();
    process.exit(0);
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
