import bcrypt from "bcryptjs";
import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../Repositories/UserRepository";
import { Media } from "../types/post.type";
import { AuthPayload, SignUpArgs } from "../types/User.type";
import { AskEntryPermission } from "../utils/exponentialDelayToken.utils";
import { logger } from "../utils/pino.utils";
import { generateToken, getRefreshedAccessToken } from "../utils/token.utils";

export const login = async (_: any, args: { email: string; password: string }): Promise<AuthPayload> => {
  try {
    const { email, password } = args;

    const user = await getRepository(User).findOne({ email });
    const isEntryAllowed = await AskEntryPermission(user.id);
    if (isEntryAllowed) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        await getRepository(User).update({ email }, { LastLoginTime: new Date(), FalseLoginAttempts: 0, LoginDelay: 0 });
        return generateToken(user.id, email);
      }
      await getRepository(User).update(
        { email },
        { LoginDelay: parseInt(Math.exp(user.FalseLoginAttempts + 1).toFixed(0), 10), FalseLoginAttempts: user.FalseLoginAttempts + 1 }
      );
      throw new Error("Wrong Credentials");
    }
    throw new Error("This user is not allowed to login for now");
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const signUp = async (_: any, args: { data: SignUpArgs }): Promise<AuthPayload> => {
  try {
    const addedUser = await getCustomRepository(UserRepository).createNew(args.data);
    return generateToken(addedUser.id, addedUser.email);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getAccessToken = (_: any, args: { token: string }): AuthPayload => {
  try {
    return getRefreshedAccessToken(args.token);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const updateUserImage = async (
  _: any,
  args: { data: { media: Media; type: "Avatar" | "Cover" } },
  ctx: { userId: string }
): Promise<boolean> => {
  try {
    console.log(args.data);
    await getCustomRepository(UserRepository).updateUserImage(args.data, ctx.userId);
    return true;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
