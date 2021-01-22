import { Request, Response } from "express";
import { logger } from "./pino.utils";

export const LeakyBucket = (req: Request, res: Response, next) => {
  try {
    console.log(req.ip);
    next();
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error");
  }
};
