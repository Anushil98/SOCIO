import { createPost } from "../../resolvers/Post.mutation";
import { login, signUp } from "../../resolvers/User.mutation";

const Mutation = {
  InitMutation: () => {
    return "Test Passed";
  },
  signUp,
  login,
  createPost
};

export default Mutation;
