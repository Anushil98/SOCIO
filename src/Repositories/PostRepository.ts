import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entity/Posts";
import { PostInput } from "../types/post.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  createPost = async (data: PostInput, userId: string) => {
    try {
      const { Media, text } = data;
      const post = new Post();
      post.userId = userId;
      post.Media = Media;
      post.text = text;
      const savedpost = await this.save(post);
      logger.info("Post Saved");
      return savedpost;
    } catch (err) {
      logger.error(err);
      throw new Error("INternal Server Error");
    }
  };
}
