import { getCustomRepository, getRepository } from "typeorm";
import { Post } from "../entity/Posts";
import { Tag } from "../entity/Tag";
import { PostRepository } from "../Repositories/PostRepository";
import { PostTagRepository } from "../Repositories/PostTagRepository";
import { TagRepository } from "../Repositories/TagRepository";
import { PostInput, TagInput } from "../types/post.type";
import { logger } from "../utils/pino.utils";

export const createPost = async (_: any, args: { data: PostInput; tags: TagInput[] }, ctx: { userId: string }): Promise<Post> => {
  try {
    const tagIds = [];
    if (args.tags && args.tags.length > 0) {
      await Promise.all(
        args.tags.map(async tag => {
          const { tagId, tagName } = tag;
          if (tagId) {
            if ((await getRepository(Tag).count({ tagId })) > 0) {
              tagIds.push(tagId);
            } else throw new Error("TagId is Wrong, try to save a new tag");
          } else {
            const newTag = await getCustomRepository(TagRepository).createNewTag({ tagName, userId: ctx.userId });
            tagIds.push(newTag.tagId);
          }
        })
      );
    }
    const newPost = await getCustomRepository(PostRepository).createPost(args.data, ctx.userId);
    if (tagIds.length > 0) {
      try {
        await Promise.all(
          tagIds.map(async tagId => {
            await getCustomRepository(PostTagRepository).createNewPostTag({ tagId, postId: newPost.postId });
          })
        );
      } catch (err) {
        logger.error(err);
        await getRepository(Post).delete({ postId: newPost.postId });
        throw new Error("Error in creating post tag relationship");
      }
    }
    return newPost;
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error!");
  }
};

export const getUserPosts = async (_: any, args: { userId: string; grpId: string }, ctx: { userId: string }) => {
  try {
    return getCustomRepository(PostRepository).getUserPosts(args.userId, args.grpId);
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error!!");
  }
};

export const getChildPosts = async (_: any, args: { parentId: string; grpId: string }, ctx: { userId: string }) => {
  try {
    return getCustomRepository(PostRepository).getChildrenPosts(args.parentId, args.grpId);
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error!!");
  }
};
