import { getCustomRepository, getRepository } from "typeorm";
import { Group } from "../entity/Group";
import { GroupMember } from "../entity/GroupMember";
import { GroupRepository } from "../Repositories/GroupRepository";
import { GroupInput } from "../types/Group.type";
import { logger } from "../utils/pino.utils";

export const createGroup = async (_: any, args: { data: GroupInput }, ctx: { userId: string }): Promise<Group> => {
  try {
    console.log(ctx.userId);
    return getCustomRepository(GroupRepository).createGroup({ ...args.data, ownerId: ctx.userId });
  } catch (err) {
    throw new Error(err);
  }
};

export const getUsersGroups = async (_: any, args: { page: number }, ctx: { userId: string }): Promise<Group[]> => {
  try {
    const GroupMembers = await getRepository(GroupMember).find({
      where: { userId: ctx.userId },
      relations: ["Group"],
      order: { createdDate: "DESC" }
    });
    return GroupMembers.map(member => member.Group);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
