import { NextFunction, Request, Response } from "express";
import { object, number, InferType } from "yup";

const getKeymapsParams = object().shape({
  keyboardId: number().required(),
});

export type GetKeymapsParams = InferType<typeof getKeymapsParams>;

export function validateGetKeymapsParams(
  req: Request<{ keyboardId?: any }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.params || !getKeymapsParams.isValidSync(req.params)) {
    res.status(400);
    return next(new Error("Bad Request"));
  }

  req.params = getKeymapsParams.cast(req.params);

  next();
}
