import { getInvites } from "../../resolvers/Invite.mutation";
import { getChildPosts, getUserPosts } from "../../resolvers/Post.mutation";

const Query = {
  InitQuery: () => {
    return "Test Passed";
  },
  getUserPosts,
  getChildPosts,
  // Invites
  getInvites
};

export default Query;
