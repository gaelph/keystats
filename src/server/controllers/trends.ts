import { Router } from "express";
import { z } from "zod";
import { projectionDate, projectionKeyboardParam } from "../../common/dist/dto/projection.js";
import RecordRepo from "../../service/repository/recordRepo.js";
import KeyboardRepo from "../../service/repository/keyboardRepo.js";
import KeysRepo from "../../service/repository/keysRepo.js";
import KeyboardService from "../../service/keyboardService.js";
import { NotFoundError } from "../../service/database.js";
import { makeTrends } from "../../service/trends.js";

const querySchema = z.object({ start: projectionDate.optional(), end: projectionDate,
  grouping: z.enum(["auto", "daily", "weekly", "monthly"]) }).strict();

export default function trendsRouter() {
  const router = Router({ mergeParams: true });
  const records = new RecordRepo(), keyboards = new KeyboardRepo(), keys = new KeysRepo(), service = new KeyboardService();
  router.get("/", async (req, res, next) => {
    const params = projectionKeyboardParam.safeParse(req.params), query = querySchema.safeParse(req.query);
    if (!params.success || !query.success || (query.data.start && query.data.start > query.data.end)) {
      res.status(400).json({ error: "Expected a valid date range and grouping" }); return;
    }
    try {
      const id = params.data.keyboardId;
      const keyboard = await keyboards.getById(id);
      const [dates, history, layouts, physicalKeys] = await Promise.all([
        records.getAvailableDates(id), records.getProjectionData(id), service.getKeymap(keyboard), keys.getForKeyboard(id),
      ]);
      const canonicalDates = dates.map((date) => {
        const [y, m, d] = date.split("-"); return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }).filter((date) => projectionDate.safeParse(date).success).sort();
      const start = query.data.start || canonicalDates[0] || query.data.end;
      if (start > query.data.end || (Date.parse(query.data.end) - Date.parse(start)) / 86400000 > 36525) {
        res.status(400).json({ error: "Invalid or excessively long date range" }); return;
      }
      const positions = await records.getTrendPositions(id, start, query.data.end);
      const days = (Date.parse(query.data.end) - Date.parse(start)) / 86400000 + 1;
      const grouping = query.data.grouping === "auto" ? days <= 90 ? "daily" : days <= 365 ? "weekly" : "monthly" : query.data.grouping;
      const keymaps = Array.from({ length: layouts.length }, (_, layerId) => {
        const layer = layouts[layerId] || [];
        const columns = Math.max(0, ...Array.from(layer, (row) => row?.length || 0));
        return Array.from({ length: layer.length }, (_, row) => Array.from({ length: columns }, (_, column) => layer[row]?.[column] || []));
      });
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      res.json(makeTrends(id, start, query.data.end, grouping, positions, history.positions, {
        keymaps, keymapUsage: [], totalKeypresses: 0,
        physicalKeys: physicalKeys.map(({ row, column, hand, finger }) => ({ row, column,
          hand: Number.isInteger(hand) && hand >= 0 && hand <= 1 ? hand : null,
          finger: Number.isInteger(finger) && finger >= 0 && finger <= 9 ? finger : null })),
      }, today));
    } catch (error) {
      if (error instanceof NotFoundError) res.status(404).json({ error: "Keyboard not found" });
      else next(error);
    }
  });
  return router;
}
