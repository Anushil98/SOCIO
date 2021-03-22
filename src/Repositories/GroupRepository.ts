import { EntityRepository, Repository } from "typeorm";
import { Group } from "../entity/Group";
import { GroupInput } from "../types/Group.type";
import { logger } from "../utils/pino.utils";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  createGroup = async (data: GroupInput): Promise<Group> => {
    try {
      const grp = new Group();
      grp.grpBio = data.grpBio;
      grp.grpHandle = data.grpHandle;
      grp.grpName = data.grpName;
      grp.ownerId = data.ownerId;
      return this.save(grp);
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };
}
