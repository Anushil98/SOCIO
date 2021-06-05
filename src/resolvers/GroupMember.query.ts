import { getCustomRepository } from "typeorm";
import { GroupRepository } from "../Repositories/GroupRepository";
import { logger } from "../utils/pino.utils";

export const CheckGroupMembership = async (_: any, args: { grpId: string }, ctx: { userId: string }): Promise<boolean> => {
  try {
    return getCustomRepository(GroupRepository).checkGroupMembership(ctx.userId, args.grpId);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
