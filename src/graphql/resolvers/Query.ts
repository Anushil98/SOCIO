import { getInvites } from "../../resolvers/Invite.mutation";
import { getChildPosts, getUserPosts } from "../../resolvers/Post.mutation";
import { getFeedPosts } from "../../resolvers/Post.query";
import { getTagsBySearchText } from "../../resolvers/Tag.query";
import { getUserRelationCounts } from "../../resolvers/UserFollow.query";

const Query = {
  InitQuery: () => {
    return "Test Passed";
  },
  getUserPosts,
  getChildPosts,
  getFeedPosts,
  // Invites
  getInvites,
  // tags
  getTagsBySearchText,
  // User Follow
  getUserRelationCounts
};

export default Query;
