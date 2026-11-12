import { Router } from "express";
import { projectionKeyboardParam, projectionQuery, projectionSource } from "../../common/dist/dto/projection.js";
import RecordRepo from "../../service/repository/recordRepo.js";
import KeyboardRepo from "../../service/repository/keyboardRepo.js";
import { NotFoundError } from "../../service/database.js";
import KeyboardService from "../../service/keyboardService.js";
import KeysRepo from "../../service/repository/keysRepo.js";
import { frenchProfile, printingOnly } from "../../common/dist/projection/index.js";

export default function projectionRouter(records = new RecordRepo(), keyboards = new KeyboardRepo()) {
  const router = Router({ mergeParams: true });
  const keyboardService = new KeyboardService();
  const keys = new KeysRepo();
  router.get("/", async (req, res, next) => {
    const params = projectionKeyboardParam.safeParse(req.params);
    const query = projectionQuery.safeParse(req.query);
    if (!params.success || !query.success) {
      res.status(400).json({ error: "Expected a positive keyboard ID and an optional valid YYYY-MM-DD date only" });
      return;
    }
    try {
      const keyboard = await keyboards.getById(params.data.keyboardId);
      const { groups, keymapUsage, positions } = await records.getProjectionData(params.data.keyboardId, query.data.date);
      const sourceEventCount = groups.reduce((sum, group) => sum + group.count, 0);
      const [layouts, physicalKeys] = await Promise.all([
        keyboardService.getKeymap(keyboard), keys.getForKeyboard(params.data.keyboardId),
      ]);
      // Preserve empty physical positions rather than serializing sparse arrays
      // as null. This also makes old/partial stored layers inspectable.
      const keymaps = Array.from({ length: layouts.length }, (_, layerId) => {
        const layer = layouts[layerId] || [];
        const columns = Math.max(0, ...Array.from(layer, (row) => row?.length || 0));
        return Array.from({ length: layer.length }, (_, row) =>
          Array.from({ length: columns }, (_, column) => layer[row]?.[column] || []));
      });
      const body = projectionSource.parse({
        keyboardId: params.data.keyboardId, date: query.data.date || null, groups,
        sourceEventCount,
        observed: { keymapUsage, totalKeypresses: sourceEventCount, keymaps,
          physicalKeys: physicalKeys.map(({ row, column, hand, finger }) => ({ row, column,
            hand: Number.isInteger(hand) && hand >= 0 && hand <= 1 ? hand : null,
            finger: Number.isInteger(finger) && finger >= 0 && finger <= 9 ? finger : null,
          })),
        },
      });
      res.json(projectionSource.parse({ ...body, printing: printingOnly(body, positions, frenchProfile) }));
    } catch (error) {
      if (error instanceof NotFoundError) res.status(404).json({ error: "Keyboard not found" });
      else next(error);
    }
  });
  return router;
}
