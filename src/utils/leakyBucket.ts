import { Request } from "express";
import { getAsyncRedis, redisClient } from "../config/redisConfig";
import { IpToken } from "../types/User.type";
import { logger } from "./pino.utils";

export const LeakyBucket = async (req: Request, MAX_TOKENS: number, TOKEN_WINDOW: number, name: string) => {
  try {
    const key = `user::${req.ip}::resolver::${name}`;
    const redisWindow: string = await getAsyncRedis(key);
    if (redisWindow) {
      const tokenInfo: IpToken = JSON.parse(redisWindow.toString());
      if (tokenInfo.tokens === 0) {
        return false;
      }
      const lastFill = tokenInfo.timestamp;
      if (Date.now() - lastFill <= TOKEN_WINDOW) {
        tokenInfo.tokens -= 1;
      } else {
        tokenInfo.timestamp = Date.now();
        tokenInfo.tokens = MAX_TOKENS;
      }
      redisClient.set(key, JSON.stringify(tokenInfo));
      return true;
    }
    const tokenInit: IpToken = { ip: req.ip, timestamp: Date.now(), tokens: MAX_TOKENS - 1 };
    redisClient.set(key, JSON.stringify(tokenInit));
    return false;
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error");
  }
};
