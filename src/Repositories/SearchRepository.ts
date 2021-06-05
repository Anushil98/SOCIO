import { EntityRepository, getRepository, Repository } from "typeorm";
import { Group } from "../entity/Group";
import { Search } from "../entity/Search";
import { User } from "../entity/User";
import { logger } from "../utils/pino.utils";

@EntityRepository(Search)
export class SearchRepository extends Repository<Search> {
  addToSearch = async (data: { userId?: string; grpId?: string }): Promise<void> => {
    try {
      if (data.userId) {
        const user = await getRepository(User).findOne({ id: data.userId });
        await this.save({ userId: data.userId, searchText: user.firstname });
        await this.save({ userId: data.userId, searchText: user.lastname });
        await this.save({ userId: data.userId, searchText: `${user.firstname}${user.lastname ? ` ${user.lastname}` : ""}` });
      }
      if (data.grpId) {
        const group = await getRepository(Group).findOne({ grpId: data.grpId });
        await this.save({ grpId: data.grpId, searchText: group.grpHandle });
        await this.save({ grpId: data.grpId, searchText: group.grpName });
      }
    } catch (err) {
      throw new Error("Error on Adding to search");
    }
  };

  fillTable = async () => {
    try {
      const users = await getRepository(User).find();
      const groups = await getRepository(Group).find();
      await Promise.all(
        users.map(async user => {
          await this.addToSearch({ userId: user.id });
        })
      );
      await Promise.all(
        groups.map(async group => {
          await this.addToSearch({ grpId: group.grpId });
        })
      );
    } catch (err) {
      logger.error(err);
      throw new Error(err);
    }
  };
}
