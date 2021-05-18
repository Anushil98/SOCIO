import { getCustomRepository } from "typeorm";
import { UserFollowRepository } from "../Repositories/UserFollowRepository";
import { logger } from "../utils/pino.utils";

export const getUserRelationCounts = async (_: any, args: { userId: string }): Promise<{ followers: number; followings: number }> => {
  try {
    return getCustomRepository(UserFollowRepository).getUserRelationsCounts(args.userId);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
