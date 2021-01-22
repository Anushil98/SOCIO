import { Request, Response } from "express";
import { logger } from "./pino.utils";

export const LeakyBucket = (req: Request, res: Response, next) => {
  try {
    if (req.body.variables === undefined) next();
    if (req.body.variables.IDVAR === 1) {
      setTimeout(() => {
        next();
      }, 10000);
    } else next();
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error");
  }
};
