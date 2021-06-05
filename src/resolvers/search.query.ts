/* eslint-disable no-await-in-loop */
import { getRepository } from "typeorm";
import { Group } from "../entity/Group";
import { GroupMember } from "../entity/GroupMember";
import { Search } from "../entity/Search";
import { User } from "../entity/User";
import { logger } from "../utils/pino.utils";

export const searchUser = async (_: any, args: { searchText: string; page: number; grpId?: string }): Promise<{ user: User; group: Group }[]> => {
  try {
    const searchRes = await getRepository(Search)
      .createQueryBuilder("search")
      .select(`COALESCE("search"."userId"::text,"search"."grpId"::text) as "ID", max("search"."score") as "score"`)
      .where('LOWER("search"."searchText") like :searchText', {
        searchText: `%${args.searchText.toLowerCase()}%`
      })
      .groupBy('"ID"')
      .orderBy('"score"', "DESC")
      .skip((args.page - 1) * 10)
      .take(10)
      .getRawMany();
    console.log(searchRes);
    const res: { user: User; group: Group }[] = Array(searchRes.length);
    for (let index = 0; index < searchRes.length; index += 1) {
      const group = await getRepository(Group).findOne({ grpId: searchRes[index].ID });
      const user = await getRepository(User).findOne({ id: searchRes[index].ID });
      if (user && args.grpId) {
        const ismember = await getRepository(GroupMember).count({ grpId: args.grpId, userId: user.id });
        user.ismember = ismember > 0;
      }
      if (args.grpId) res[index] = { user, group: null };
      else res[index] = { user, group };
    }
    if (res === null) return [];
    return res;
  } catch (err) {
    logger.error(err);
  }
};
