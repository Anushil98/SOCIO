import { getUsersGroups } from "../../resolvers/Group.mutation";
import { getGroupDetails } from "../../resolvers/Group.query";
import { CheckGroupMembership } from "../../resolvers/GroupMember.query";
import { getInvites } from "../../resolvers/Invite.mutation";
import { getChildPosts, getUserPosts } from "../../resolvers/Post.mutation";
import { getFeedPosts, getGroupPosts, getUserPostApi, getUsersGroupPosts } from "../../resolvers/Post.query";
import { searchUser } from "../../resolvers/search.query";
import { getTagsBySearchText } from "../../resolvers/Tag.query";
import { getUserDetails } from "../../resolvers/User.query";
import { getUserRelationCounts } from "../../resolvers/UserFollow.query";

const Query = {
  InitQuery: () => {
    return "Test Passed";
  },
  // User
  getUserDetails,

  // Group
  getGroupDetails,
  getUsersGroups,

  // GroupMember
  CheckGroupMembership,
  // Post
  getUserPosts,
  getChildPosts,
  getFeedPosts,
  getGroupPosts,
  getUsersGroupPosts,
  getUserPostApi,

  // Invites
  getInvites,
  // tags
  getTagsBySearchText,
  // User Follow
  getUserRelationCounts,
  // Search
  searchUser
};

export default Query;
