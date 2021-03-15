import { getUserPosts } from "../../resolvers/Post.mutation";

const Query = {
  InitQuery: () => {
    return "Test Passed";
  },
  getUserPosts
};

export default Query;
