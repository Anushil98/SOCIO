/* eslint-disable no-await-in-loop */
import { getRepository } from "typeorm";
import { Group } from "../entity/Group";
import { Search } from "../entity/Search";
import { User } from "../entity/User";
import { logger } from "../utils/pino.utils";

export const searchUser = async (_: any, args: { searchText: string; page: number }): Promise<{ user: User; group: Group }[]> => {
  try {
    const searchRes = await getRepository(Search)
      .createQueryBuilder("search")
      .select('COALESCE("search"."userId"::text,"search"."grpId"::text) as "ID", max("search"."score") as "score"')
      .where('LOWER("search"."searchText") like :searchText', { searchText: `%${args.searchText}%` })
      .groupBy('"ID"')
      .orderBy('"score"', "DESC")
      .skip((args.page - 1) * 10)
      .take(10)
      .getRawMany();
    const res: { user: User; group: Group }[] = Array(searchRes.length);
    for (let index = 0; index < searchRes.length; index += 1) {
      if (searchRes[index].grpId) {
        res[index].group = await getRepository(Group).findOne({ grpId: searchRes[index].grpId });
      } else if (searchRes[index].userId) {
        res[index].user = await getRepository(User).findOne({ id: searchRes[index].userId });
      }
    }
    return res;
  } catch (err) {
    logger.error(err);
  }
};
