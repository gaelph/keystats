import { Router } from "express";
import type { Request, Response } from "express";

import RecordService from "../../service/recordService.js";
import HandService from "../../service/handService.js";
import FingerService from "../../service/fingerService.js";
import KeyboardService from "../../service/keyboardService.js";
import {
  GetKeymapsParams,
  validateGetKeymapsParams,
} from "../dto/keyboardsDto.js";
import * as Keycodes from "../../lib/keycodes.js";
import { formatKeyCode } from "../../lib/formatKeycodes.js";
import { RecordCount } from "../../service/repository/recordRepo.js";

const router = Router();

const recordService = new RecordService();
const handService = new HandService();
const fingerService = new FingerService();
const keyboardService = new KeyboardService();

async function listKeyboards(req: Request, res: Response) {
  const keyboards = await keyboardService.listKeyboards();
  res.json({ keyboards });
}

async function getKeymaps(req: Request<GetKeymapsParams>, res: Response) {
  const keyboard = await keyboardService.getKeyboard(req.params.keyboardId);
  if (!keyboard) {
    return res.status(404).send();
  }

  const keymap = await keyboardService.getKeymap(keyboard);

  res.json({ keymaps: keymap });
}

async function getDates(req: Request, res: Response) {
  console.log("get dates", req.params.keyboardId);
  if (!req.params.keyboardId) {
    return res.status(404).send();
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const dates = await recordService.getAvailableDates(keyboardId);

  res.json({ dates });
}

async function getTotalCounts(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404).send();
  }

  let date: Date | undefined = undefined;
  if (req.query.date) {
    date = new Date(req.query.date as string);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const results = await Promise.all([
    await recordService.getKeymapUsage(keyboardId, { date }),
    await recordService.getLayerUsage(keyboardId, { date }),
    await recordService.getRowUsage(keyboardId, { date }),
    await recordService.getHandUsage(keyboardId, { date }),
    await recordService.getFingerUsage(keyboardId, { date }),
    await recordService.getTotalKeypresses(keyboardId, { date }),
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
}

async function getCharacterCounts(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404).send();
  }

  let date: Date | undefined = undefined;
  if (req.query.date) {
    date = new Date(req.query.date as string);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const records = await recordService.getCharacterCount(keyboardId, { date });
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
}

async function getHandAndFingerCounts(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404).send();
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const handUsage = await handService.getHandUsage(keyboardId);
  const fingerUsage = await fingerService.getFingerUsage(keyboardId);

  res.json({ handUsage, fingerUsage });
}

router.get("/", listKeyboards);
router.get("/:keyboardId/available-dates", getDates);
router.get("/:keyboardId/keymaps", [validateGetKeymapsParams], getKeymaps);
router.get("/:keyboardId/totalCounts", getTotalCounts);
router.get("/:keyboardId/characterCounts", getCharacterCounts);
router.get("/:keyboardId/handAndFingerUsage", getHandAndFingerCounts);

export default router;
