import { getCustomRepository } from "typeorm";
import { Post } from "../entity/Posts";
import { PostRepository } from "../Repositories/PostRepository";
import { PostInput } from "../types/post.type";
import { logger } from "../utils/pino.utils";

export const createPost = async (_: any, args: { data: PostInput }, ctx: { userId: string }): Promise<Post> => {
  try {
    return getCustomRepository(PostRepository).createPost(args.data, ctx.userId);
  } catch (err) {
    logger.error(err);
    throw new Error("INternal Server Error!");
  }
};

export const getUserPosts = async (_: any, args: { userId: string }, ctx: { userId: string }) => {
  try {
    return getCustomRepository(PostRepository).getUserPosts(args.userId);
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error!!");
  }
};
