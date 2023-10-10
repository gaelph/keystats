import { Router } from "express";
import type { Request, Response } from "express";
import db from "../../service/database.js";
import LayerRepo from "../../service/repository/layerRepo.js";
import KeysRepo from "../../service/repository/keysRepo.js";
import KeyboardRepo from "../../service/repository/keyboardRepo.js";
import KeyboardService from "../../service/keyboardService.js";
import RecordRepo from "../../service/repository/recordRepo.js";
import RecordService from "../../service/recordService.js";
import KeyHandler from "../../lib/eventHandler.js";
import HandService from "../../service/handService.js";
import HandUsageRepo from "../../service/repository/handUsagerRepo.js";
import FingerService from "../../service/fingerService.js";
import FingerUsageRepo from "../../service/repository/fingerUsageRepo.js";

const router = Router();

const layerRepo = new LayerRepo(db);
const keyboardRepo = new KeyboardRepo(db);
const keysRepo = new KeysRepo(db);
const recordRepo = new RecordRepo(db);
const recordService = new RecordService(recordRepo);
const handService = new HandService(new HandUsageRepo(db), keysRepo);
const fingerService = new FingerService(new FingerUsageRepo(db), keysRepo);
const keyboardService = new KeyboardService(
  keyboardRepo,
  layerRepo,
  keysRepo,
  recordService,
  handService,
  fingerService,
  new KeyHandler(),
);

async function listKeyboards(req: Request, res: Response) {
  const keyboards = await keyboardService.listKeyboards();
  res.json({ keyboards });
}

async function getKeyboard(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const keymap = await keyboardService.getKeymap(keyboardId);

  res.json({ keymaps: keymap });
}

async function getRecords(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const records = await recordService.getRecords(keyboardId);

  res.json({ records });
}

async function getTotalCounts(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const counts = await recordService.getTotalCounts(keyboardId);

  res.json({ counts });
}

async function getCharacterCounts(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const records = await recordService.getPlainRecords(keyboardId);

  res.json({ records });
}

async function getHandAndFingerCounts(req: Request, res: Response) {
  if (!req.params.keyboardId) {
    return res.status(404);
  }

  const keyboardId = parseInt(req.params.keyboardId, 10);
  const handUsage = await handService.getHandUsage(keyboardId);
  const fingerUsage = await fingerService.getFingerUsage(keyboardId);

  res.json({ handUsage, fingerUsage });
}

router.get("/", listKeyboards);
router.get("/:keyboardId/keymaps", getKeyboard);
router.get("/:keyboardId/records", getRecords);
router.get("/:keyboardId/totalCounts", getTotalCounts);
router.get("/:keyboardId/characterCounts", getCharacterCounts);
router.get("/:keyboardId/handAndFingerUsage", getHandAndFingerCounts);

export default router;
