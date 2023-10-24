import type { Logger } from "loglevel";
import type { NextFunction, Request, Response } from "express";

export default function (logger: Logger) {
  return function (req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const url = new URL(req.url, `http://localhost:${process.env.PORT}`);
    const status = res.statusCode;
    logger.info(`${status} — ${method} ${url}`);

    next();
  };
}
