import { NextFunction, Request, Response } from "express";
import { object, number, InferType, ObjectSchema, date } from "yup";

export const keyboardIdParam = object().shape({
  keyboardId: number().required(),
});

export type KeyboardIdParam = InferType<typeof keyboardIdParam>;

export const filterQuery = object().shape({
  date: date().optional(),
});

export type FilterQuery = InferType<typeof filterQuery>;

export function validateParams(
  schema: ObjectSchema<any>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema.isValidSync(req.params)) {
      res.status(400);
      return next(new Error("Bad Request"));
    }
    req.params = schema.cast(req.params);

    next();
  };
}

export function validateQuery(
  schema: ObjectSchema<any>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.query &&
      Object.keys(req.query).length &&
      !schema.isValidSync(req.query)
    ) {
      res.status(400);
      return next(new Error("Bad Request"));
    }
    req.query = schema.cast(req.query);

    next();
  };
}
