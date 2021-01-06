import { login, signUp } from "../../resolvers/User.mutation";

const Mutation = {
  InitMutation: () => {
    return "Test Passed";
  },
  signUp,
  login
};

export default Mutation;
