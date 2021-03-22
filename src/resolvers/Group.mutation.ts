import { getCustomRepository } from "typeorm";
import { Group } from "../entity/Group";
import { GroupRepository } from "../Repositories/GroupRepository";
import { GroupInput } from "../types/Group.type";

export const createGroup = async (_: any, args: { data: GroupInput }, ctx: { userId: string }): Promise<Group> => {
  try {
    return getCustomRepository(GroupRepository).createGroup({ ...args.data, ownerId: ctx.userId });
  } catch (err) {
    throw new Error(err);
  }
};
