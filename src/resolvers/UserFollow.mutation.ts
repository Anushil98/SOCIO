import { getCustomRepository } from "typeorm";
import { UserFollowRepository } from "../Repositories/UserFollowRepository";
import { logger } from "../utils/pino.utils";

export const FollowUser = async (_: any, args: { userId: string }, ctx: { userId }): Promise<boolean> => {
  try {
    return getCustomRepository(UserFollowRepository).followUser(ctx.userId, args.userId);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const RejectFollowRequest = async (_: any, args: { userId: string }, ctx: { userId }): Promise<boolean> => {
  try {
    return getCustomRepository(UserFollowRepository).cancelFollow(args.userId, ctx.userId);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const Unfollow = async (_: any, args: { userId: string }, ctx: { userId }): Promise<boolean> => {
  try {
    return getCustomRepository(UserFollowRepository).cancelFollow(ctx.userId, args.userId);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const RemoveFollower = async (_: any, args: { userId: string }, ctx: { userId }): Promise<boolean> => {
  try {
    return getCustomRepository(UserFollowRepository).cancelFollow(args.userId, ctx.userId);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
