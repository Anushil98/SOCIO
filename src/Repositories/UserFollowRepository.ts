import { EntityRepository, getRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import UserFollow from "../entity/UserFollow";
import { logger } from "../utils/pino.utils";

@EntityRepository(UserFollow)
export class UserFollowRepository extends Repository<UserFollow> {
  followUser = async (followerId: string, followingId: string): Promise<boolean> => {
    try {
      const UserToBeFollowed = await getRepository(User).findOne({ id: followingId });
      const follow = new UserFollow();
      follow.followerId = followerId;
      follow.followingId = followingId;
      if (UserToBeFollowed.UserType === "Public") follow.followStatus = "Resolved";
      else follow.followStatus = "Pending";
      await this.save(follow);
      return true;
    } catch (err) {
      logger.error(err);
      throw new Error("Cannot follow this user");
    }
  };

  cancelFollow = async (followerId: string, followingId: string): Promise<boolean> => {
    try {
      await this.delete({ followerId, followingId });
      return true;
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };

  getFollowInfo = async (followerId: string, followingId: string): Promise<UserFollow> => {
    try {
      return this.findOne({ followerId, followingId });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };

  acceptFollowRequest = async (followerId: string, followingId: string): Promise<boolean> => {
    try {
      const updateRes = await this.update({ followerId, followingId }, { followStatus: "Resolved" });
      if (updateRes.affected > 0) {
        return true;
      }
      throw new Error("Follow Request Has not been sent");
    } catch (err) {
      logger.error(err);
      throw new Error(err);
    }
  };

  getUserRelationsCounts = async (userId: string): Promise<{ followers: number; followings: number }> => {
    try {
      const followers = await this.count({ followingId: userId });
      const followings = await this.count({ followerId: userId });
      return { followers, followings };
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };
}
