import { getCustomRepository, getRepository } from "typeorm";
import { Invite } from "../entity/Invite";
import { InviteRepository } from "../Repositories/InviteRepository";
import { InviteInput, InviteStateEnum } from "../types/Invite.type";
import { logger } from "../utils/pino.utils";

export const createInvite = (_: any, args: { data: InviteInput }, ctx: { userId: string }): Promise<Invite> => {
  try {
    const { guestId, grpId } = args.data;
    return getCustomRepository(InviteRepository).createInvite({ guestId, hostId: ctx.userId, grpId });
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
};

export const getInvites = (_: any, args: { page: number }, ctx: { userId: string }): Promise<Invite[]> => {
  try {
    return getRepository(Invite).find({
      where: { guestId: ctx.userId },
      relations: ["Host", "Guest", "Group"],
      order: { createdDate: "DESC" },
      skip: (args.page - 1) * 3,
      take: 3
    });
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error");
  }
};
export const ActionOnInvite = (
  _: any,
  args: { action: InviteStateEnum; inviteId: string; grpId: string },
  ctx: { userId: string }
): Promise<boolean> => {
  try {
    const { action, inviteId, grpId } = args;
    return getCustomRepository(InviteRepository).ActionOnInvite({ action, inviteId, grpId, userId: ctx.userId });
  } catch (err) {
    logger.error(err);
    throw new Error("Internal Server Error");
  }
};
