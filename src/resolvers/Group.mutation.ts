import { getCustomRepository, getRepository } from "typeorm";
import { Group } from "../entity/Group";
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
    return getRepository(Group).find({ where: { ownerId: ctx.userId }, skip: (args.page - 1) * 3, take: 3, order: { createdDate: "DESC" } });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
