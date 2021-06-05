import bcrypt from "bcryptjs";
import { EntityRepository, getCustomRepository, getRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import { Media } from "../types/post.type";
import { SignUpArgs } from "../types/User.type";
import { logger } from "../utils/pino.utils";
import { SearchRepository } from "./SearchRepository";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createNew = async (data: SignUpArgs): Promise<User> => {
    try {
      const { email, userType, firstname, lastname, password, username } = data;
      const emailAvailability = await getRepository(User).count({ email });

      if (emailAvailability === 0) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User();
        user.email = email;
        user.UserType = userType;
        user.password = hash;
        user.firstname = firstname;
        user.lastname = lastname;
        user.username = username;
        const addedUser = await getRepository(User).save(user);
        await getCustomRepository(SearchRepository).addToSearch({ userId: addedUser.id });
        return addedUser;
      }
      throw new Error("Email already exist");
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };

  updateUserImage = async (data: { media: Media; type: "Avatar" | "Cover" }, userId: string) => {
    try {
      if (data.type === "Avatar") await getRepository(User).update({ id: userId }, { avatar: data.media.filename });
      if (data.type === "Cover") await getRepository(User).update({ id: userId }, { cover: data.media.filename });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };
}
