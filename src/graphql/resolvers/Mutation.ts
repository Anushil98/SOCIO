import { createGroup } from "../../resolvers/Group.mutation";
import { ActionOnInvite, createInvite } from "../../resolvers/Invite.mutation";
import { createPost } from "../../resolvers/Post.mutation";
import { getAccessToken, login, signUp, updateUserImage } from "../../resolvers/User.mutation";
import { FollowUser, RejectFollowRequest, RemoveFollower, Unfollow } from "../../resolvers/UserFollow.mutation";

const Mutation = {
  InitMutation: () => {
    return "Test Passed";
  },
  // User
  signUp,
  login,
  getAccessToken,
  updateUserImage,
  // Post
  createPost,
  // Group
  createGroup,
  // Invite
  ActionOnInvite,
  createInvite,
  // User Follow
  FollowUser,
  Unfollow,
  RemoveFollower,
  RejectFollowRequest
};

export default Mutation;
