import { getCustomRepository } from "typeorm";
import { Tag } from "../entity/Tag";
import { TagRepository } from "../Repositories/TagRepository";

export const getTagsBySearchText = async (_: any, args: { searchText: string }, ctx: { userId: string }): Promise<Tag[]> => {
  try {
    return getCustomRepository(TagRepository).getTagsFromSearchText(args.searchText);
  } catch (err) {
    throw new Error(err);
  }
};
