import { EntityRepository, Like, Repository } from "typeorm";
import { Tag } from "../entity/Tag";
import { logger } from "../utils/pino.utils";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  createNewTag = async (data: { tagName: string; userId: string }): Promise<Tag> => {
    try {
      const { tagName, userId } = data;
      const newTag = Object.assign<Tag, Partial<Tag>>(new Tag(), {
        tagName: tagName.toLowerCase(),
        createdBy: userId
      });
      return this.save(newTag);
    } catch (err) {
      logger.error(err);
      throw new Error("Tag Creation Error");
    }
  };

  getTagsFromSearchText = async (searchText: string): Promise<Tag[]> => {
    try {
      return this.find({ where: { tagName: Like(`%${searchText.toLowerCase()}%`) } });
    } catch (err) {
      logger.error(err);
      throw new Error("Internal Server Error");
    }
  };
}
