import { getChildPosts, getUserPosts } from "../../resolvers/Post.mutation";

const Query = {
  InitQuery: () => {
    return "Test Passed";
  },
  getUserPosts,
  getChildPosts
};

export default Query;
