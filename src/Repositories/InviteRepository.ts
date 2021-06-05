import { EntityRepository, getRepository, Repository } from "typeorm";
import { GroupMember } from "../entity/GroupMember";
import { Invite } from "../entity/Invite";
import { MemberType } from "../types/Group.type";
import { InviteInput, InviteStateEnum } from "../types/Invite.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {
  createInvite = async (data: InviteInput): Promise<Invite> => {
    try {
      const { guestId, hostId, grpId } = data;
      const ismember = await getRepository(GroupMember).findOne({ userId: guestId, grpId });
      if (ismember) {
        throw new Error("User is already a member");
      }
      const invite = new Invite();
      invite.guestId = guestId;
      invite.hostId = hostId;
      invite.grpId = grpId;
      return this.save(invite);
    } catch (err) {
      logger.error(err);
      throw new Error(err);
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
          grpmember.MemberType = MemberType.Member;
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
