import { Router } from "express";
import type { NextFunction, Request, Response } from "express";

import log from "../../lib/logger.js";
import loggerMiddleware from "../middlewares/loggerMiddleware.js";
import RecordService from "../../service/recordService.js";
import HandService from "../../service/handService.js";
import FingerService from "../../service/fingerService.js";
import KeyboardService from "../../service/keyboardService.js";
import {
  FilterQuery,
  KeyboardIdParam,
  characterCountBody,
  datesBody,
  filterQuery,
  keyboardIdParam,
  keyboardListBody,
  keymapsBody,
  repetitionsBody,
  totalCountBody,
} from "../../common/dist/dto/keyboard.js";
import {
  validateQuery,
  validateParams,
  validateBody,
  validateResponse,
} from "../dto/keyboardsDto.js";
import * as Keycodes from "../../lib/keycodes.js";
import { formatKeyCode } from "../../lib/formatKeycodes.js";
import { RecordCount } from "../../service/repository/recordRepo.js";
import { AUTH } from "sqlite3";

type KeyboardRequest = Request<KeyboardIdParam, any, any, FilterQuery>;
type KeyboardListRequest = Request<{}, any, any, {}>;
const logger = log.getLogger("KeyboardController");

const router = Router({ mergeParams: true });
const entityRouter = Router({ mergeParams: true });

const recordService = new RecordService();
const handService = new HandService();
const fingerService = new FingerService();
const keyboardService = new KeyboardService();

async function listKeyboards(
  req: KeyboardListRequest,
  res: Response,
  next: NextFunction,
) {
  const keyboards = await keyboardService.listKeyboards();
  res.json({ keyboards });
  next();
}

async function getKeymaps(
  req: KeyboardRequest,
  res: Response,
  next: NextFunction,
) {
  const { keyboardId } = req.params;

  const keyboard = await keyboardService.getKeyboard(keyboardId);
  if (!keyboard) {
    return res.status(404).send();
  }

  const keymap = await keyboardService.getKeymap(keyboard);

  res.json({ keymaps: keymap });
  next();
}

async function getDates(
  req: KeyboardRequest,
  res: Response,
  next: NextFunction,
) {
  const { keyboardId } = req.params;

  const dates = await recordService.getAvailableDates(keyboardId);

  res.json({ dates });
  next();
}

async function getTotalCounts(
  req: KeyboardRequest,
  res: Response,
  next: NextFunction,
) {
  const { keyboardId } = req.params;
  const filters = req.query;

  const results = await Promise.all([
    await recordService.getKeymapUsage(keyboardId, filters),
    await recordService.getLayerUsage(keyboardId, filters),
    await recordService.getRowUsage(keyboardId, filters),
    await recordService.getHandUsage(keyboardId, filters),
    await recordService.getFingerUsage(keyboardId, filters),
    await recordService.getTotalKeypresses(keyboardId, filters),
  ]);

  const [
    keymapUsage,
    layerUsage,
    rowUsage,
    handUsage,
    fingerUsage,
    totalKeypresses,
  ] = results;

  res.json({
    keymapUsage,
    layerUsage,
    rowUsage,
    handUsage,
    fingerUsage,
    totalKeypresses,
  });

  next();
}

async function getCharacterCounts(
  req: KeyboardRequest,
  res: Response,
  next: NextFunction,
) {
  const { keyboardId } = req.params;
  const filters = req.query;

  const records = await recordService.getCharacterCount(keyboardId, filters);
  const formattedRecords: (RecordCount & { character: string })[] =
    records.reduce(
      (acc, record) => {
        const modsToAdd = Keycodes.modifierBitfieldToMaskedModifiers(
          record.modifiers,
        );
        let keycode = parseInt(record.keycode, 16);
        keycode |= modsToAdd;

        const character = formatKeyCode(keycode.toString(16));

        if (character) {
          acc.push({
            ...record,
            character,
          });
        }

        return acc;
      },
      [] as (RecordCount & { character: string })[],
    );

  const totalCharacters = formattedRecords.reduce(
    (acc, record) => acc + (record.counts || 0),
    0,
  );

  res.json({ records: formattedRecords, totalCharacters });
  next();
}

async function getHandAndFingerCounts(
  req: KeyboardRequest,
  res: Response,
  next: NextFunction,
) {
  const { keyboardId } = req.params;
  const filters = req.query;

  const handRepetitions = await handService.getHandUsage(keyboardId, filters);
  const fingerRepetitions = await fingerService.getFingerUsage(
    keyboardId,
    filters,
  );

  res.json({ handRepetitions, fingerRepetitions });
  next();
}

router.get("/", validateResponse(keyboardListBody), listKeyboards);

entityRouter.use(validateParams(keyboardIdParam), validateQuery(filterQuery));
entityRouter.get<KeyboardIdParam>(
  "/available-dates",
  validateResponse(datesBody),
  getDates,
);
entityRouter.get<KeyboardIdParam>(
  "/keymaps",
  validateResponse(keymapsBody),
  getKeymaps,
);
entityRouter.get<KeyboardIdParam>(
  "/totalCounts",
  validateResponse(totalCountBody),
  getTotalCounts,
);
entityRouter.get<KeyboardIdParam>(
  "/characterCounts",
  validateResponse(characterCountBody),
  getCharacterCounts,
);
entityRouter.get<KeyboardIdParam>(
  "/handAndFingerUsage",
  validateResponse(repetitionsBody),
  getHandAndFingerCounts,
);

router.use("/:keyboardId", entityRouter);

entityRouter.use(loggerMiddleware(logger));
router.use(loggerMiddleware(logger));

export default router;
