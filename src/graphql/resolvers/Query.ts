import { getInvites } from "../../resolvers/Invite.mutation";
import { getChildPosts, getUserPosts } from "../../resolvers/Post.mutation";
import { getTagsBySearchText } from "../../resolvers/Tag.query";

const Query = {
  InitQuery: () => {
    return "Test Passed";
  },
  getUserPosts,
  getChildPosts,
  // Invites
  getInvites,
  // tags
  getTagsBySearchText
};

export default Query;
