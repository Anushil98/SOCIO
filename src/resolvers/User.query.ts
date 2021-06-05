import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { logger } from "../utils/pino.utils";

export const getUserDetails = (_: any, args: { userId: string }): Promise<User> => {
  try {
    return getRepository(User).findOne({ select: ["id", "firstname", "lastname", "username", "avatar", "cover"], where: { id: args.userId } });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
