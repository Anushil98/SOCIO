import _ from "lodash";
import { EntityRepository, getRepository, In, IsNull, Repository } from "typeorm";
import { GroupMember } from "../entity/GroupMember";
import { Post } from "../entity/Posts";
import UserFollow from "../entity/UserFollow";
import { PostInput } from "../types/post.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  createPost = async (data: PostInput, userId: string) => {
    try {
      const { Media, text, parentId, grpId } = data;
      const post = new Post();
      post.userId = userId;
      post.Media = Media;
      post.text = text;
      post.grpId = grpId;
      post.parentId = parentId;
      if (parentId && _.isEmpty(grpId)) {
        const parent = await this.findOne({ select: ["grpId"], where: { postId: parentId } });
        post.grpId = parent.grpId;
      }
      const savedpost = await this.save(post);
      if (parentId) {
        await this.update({ postId: parentId }, { HasChildren: true });
      }
      logger.info("Post Saved");
      return savedpost;
    } catch (err) {
      logger.error(err);
      throw new Error("INternal Server Error");
    }
  };

  getUserPosts = async (userId: string, grpId: string): Promise<Post[]> => {
    try {
      if (grpId) {
        return getRepository(Post).find({ relations: ["User", "children", "Group"], where: { userId, parentId: IsNull(), grpId } });
      }
      return getRepository(Post).find({
        relations: ["User", "children", "postTags", "postTags.Tag"],
        where: {
          userId,
          parentId: IsNull(),
          grpId: IsNull()
        },
        order: { createdDate: "DESC" }
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error!");
    }
  };

  getFeedPosts = async (userId: string): Promise<Post[]> => {
    try {
      const followings = await getRepository(UserFollow).find({ followerId: userId });
      const userIds = [...followings.map(fol => fol.followingId), userId];
      const grpIds = await getRepository(GroupMember).find({ memberId: userId });
      const conditions = [{ userId: In(userIds), grpId: IsNull() }];
      if (grpIds.length > 0) {
        conditions.push({ userId: In(userIds), grpId: In(grpIds.map(grp => grp.grpId)) });
      }
      return this.find({
        relations: ["User", "Group"],
        where: conditions,
        order: { createdDate: "DESC" }
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };

  getChildrenPosts = async (parentId: string, grpId: string): Promise<Post> => {
    try {
      if (grpId) {
        return getRepository(Post).findOne({
          relations: ["User", "Group", "children", "children.User", "children.Group"],
          where: { postId: parentId, grpId },
          order: { createdDate: "DESC" }
        });
      }
      return getRepository(Post).findOne({
        relations: ["User", "children", "children.User"],
        where: { postId: parentId, grpId: IsNull() },
        order: { createdDate: "DESC" }
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error!");
    }
  };
}
