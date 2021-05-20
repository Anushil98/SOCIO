import { EntityRepository, getCustomRepository, getRepository, Repository } from "typeorm";
import { Group } from "../entity/Group";
import { GroupMember } from "../entity/GroupMember";
import { GroupInput, MemberType } from "../types/Group.type";
import { logger } from "../utils/pino.utils";
import { SearchRepository } from "./SearchRepository";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  createGroup = async (data: GroupInput): Promise<Group> => {
    try {
      const grp = new Group();
      grp.grpBio = data.grpBio;
      grp.grpHandle = data.grpHandle;
      grp.grpName = data.grpName;
      grp.ownerId = data.ownerId;
      const savedgrp = await this.save(grp);
      const owner = new GroupMember();
      owner.grpId = savedgrp.grpId;
      owner.userId = grp.ownerId;
      owner.MemberType = MemberType.Owner;
      await getRepository(GroupMember).save(owner);
      await getCustomRepository(SearchRepository).addToSearch({ grpId: savedgrp.grpId });

      return savedgrp;
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };
}
