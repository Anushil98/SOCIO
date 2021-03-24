import { EntityRepository, getRepository, IsNull, Repository } from "typeorm";
import { Post } from "../entity/Posts";
import { PostInput } from "../types/post.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  createPost = async (data: PostInput, userId: string) => {
    try {
      const { Media, text, parentId } = data;
      const post = new Post();
      post.userId = userId;
      post.Media = Media;
      post.text = text;
      post.parentId = parentId;
      const savedpost = await this.save(post);
      await this.update({ postId: parentId }, { HasChildren: true });
      logger.info("Post Saved");
      return savedpost;
    } catch (err) {
      logger.error(err);
      throw new Error("INternal Server Error");
    }
  };

  getUserPosts = async (userId: string): Promise<Post[]> => {
    try {
      return getRepository(Post).find({ relations: ["User", "children"], where: { userId, parentId: IsNull() } });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error!");
    }
  };

  getChildrenPosts = async (parentId: string): Promise<Post> => {
    try {
      console.log(parentId);
      return getRepository(Post).findOne({ relations: ["User", "children", "children.User"], where: { postId: parentId } });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error!");
    }
  };
}
