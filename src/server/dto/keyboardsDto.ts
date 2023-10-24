import { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export function validateParams(
  schema: ZodSchema<any>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
    } catch (error) {
      res.status(400);
      return next(new Error("Bad Request"));
    }

    next();
  };
}

export function validateQuery(
  schema: ZodSchema<any>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.query && Object.keys(req.query).length) {
      try {
        req.query = schema.parse(req.query);
      } catch (error) {
        res.status(400);
        return next(new Error("Bad Request"));
      }
    }

    next();
  };
}

export function validateResponse<P>(
  schema: ZodSchema<any>,
): (req: Request<P>, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    const oldJson = res.json;

    res.json = (data: any): ReturnType<typeof oldJson> => {
      data = schema.parse(data);
      return oldJson.call(res, data);
    };

    next();
  };
}
