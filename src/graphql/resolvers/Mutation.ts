import { createGroup } from "../../resolvers/Group.mutation";
import { createPost } from "../../resolvers/Post.mutation";
import { login, signUp } from "../../resolvers/User.mutation";

const Mutation = {
  InitMutation: () => {
    return "Test Passed";
  },
  // User
  signUp,
  login,
  // Post
  createPost,
  // Group
  createGroup
};

export default Mutation;
