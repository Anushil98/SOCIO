import { getCustomRepository } from "typeorm";
import { Post } from "../entity/Posts";
import { PostRepository } from "../Repositories/PostRepository";
import { logger } from "../utils/pino.utils";

export const getFeedPosts = async (_: any, args: any, ctx: { userId: string }): Promise<Post[]> => {
  try {
    return getCustomRepository(PostRepository).getFeedPosts(ctx.userId);
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
};
