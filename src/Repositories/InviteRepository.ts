import { EntityRepository, getRepository, Repository } from "typeorm";
import { GroupMember } from "../entity/GroupMember";
import { Invite } from "../entity/Invite";
import { InviteInput, InviteStateEnum } from "../types/Invite.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
  createInvite = (data: InviteInput): Promise<Invite> => {
    try {
      const { guestId, hostId } = data;
      const invite = new Invite();
      invite.guestId = guestId;
      invite.hostId = hostId;
      return this.save(invite);
    } catch (err) {
      logger.error(err);
      throw new Error("Error in saving invite");
    }
  };

  ActionOnInvite = async (data: { action: InviteStateEnum; userId: string; inviteId: string; grpId: string }): Promise<boolean> => {
    try {
      const { action, inviteId, userId, grpId } = data;
      const updateres = await this.update({ InviteId: inviteId, guestId: userId, InviteState: InviteStateEnum.Pending }, { InviteState: action });
      if (updateres.affected > 0) {
        if (action === InviteStateEnum.Accepted) {
          const grpmember = new GroupMember();
          grpmember.grpId = grpId;
          grpmember.userId = userId;
          grpmember.inviteId = inviteId;
          await getRepository(GroupMember).save(grpmember);
        }
        return true;
      }
      return false;
    } catch (err) {
      logger.error(err);
      throw new Error("Error at Action On Invite");
    }
  };
}
