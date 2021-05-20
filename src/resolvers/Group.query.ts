import { getRepository } from "typeorm";
import { Group } from "../entity/Group";
import { logger } from "../utils/pino.utils";

export const getGroupDetails = (_: any, args: { grpId: string }): Promise<Group> => {
  try {
    return getRepository(Group).findOne({ select: ["grpId", "grpName", "grpBio", "grpHandle", "ownerId"], where: { grpId: args.grpId } });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
