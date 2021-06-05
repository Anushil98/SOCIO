import { getCustomRepository, getRepository } from "typeorm";
import UserFollow from "../entity/UserFollow";
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

export const isFollow = async (_: any, args: { userId: string }, ctx: { userId: string }): Promise<boolean> => {
  try {
    const isfollow = await getRepository(UserFollow).count({ where: { followerId: ctx.userId, followingId: args.userId } });
    if (isfollow > 0) {
      return true;
    }
    return false;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
