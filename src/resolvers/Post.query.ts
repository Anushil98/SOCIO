import { getCustomRepository } from "typeorm";
import { Post } from "../entity/Posts";
import { PostRepository } from "../Repositories/PostRepository";
import { logger } from "../utils/pino.utils";

export const getFeedPosts = async (_: any, args: { page: number }, ctx: { userId: string }): Promise<Post[]> => {
  try {
    return getCustomRepository(PostRepository).getFeedPosts(ctx.userId, args.page);
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
};

export const getUsersGroupPosts = async (_: any, args: { page: number }, ctx: { userId: string }): Promise<Post[]> => {
  try {
    return getCustomRepository(PostRepository).getUsersGroupPosts(ctx.userId, args.page);
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
};

export const getGroupPosts = async (_: any, args: { grpId: string; page: number }, ctx: { userId: string }): Promise<Post[]> => {
  try {
    return getCustomRepository(PostRepository).getGroupPosts(args.grpId, args.page);
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
};
