import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { logger } from "./pino.utils";

export const AskEntryPermission = async (userId: number): Promise<boolean> => {
  try {
    const { LoginDelay, LastLoginTime } = await getRepository(User).findOne(userId);
    logger.info({ LoginDelay, LastLoginTime, userId });
    if (LastLoginTime === null) return true;
    const currentDate = Date.now();
    if (LoginDelay + LastLoginTime.getTime() > currentDate) {
      return false;
    }
    return true;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
