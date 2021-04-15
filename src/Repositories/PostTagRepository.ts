import { EntityRepository, Repository } from "typeorm";
import { PostTag } from "../entity/PostTag";
import { logger } from "../utils/pino.utils";

@EntityRepository(PostTag)
export class PostTagRepository extends Repository<PostTag> {
  createNewPostTag = async (data: { tagId: string; postId: string }): Promise<PostTag> => {
    try {
      const { tagId, postId } = data;
      const newPostTag = Object.assign<PostTag, Partial<PostTag>>(new PostTag(), {
        postId,
        tagId
      });
      return this.save(newPostTag);
    } catch (err) {
      logger.error(err);
      throw new Error("Post Tag Creation Error");
    }
  };
}
