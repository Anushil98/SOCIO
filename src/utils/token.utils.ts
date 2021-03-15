import jwt from "jsonwebtoken";
import { keys } from "../config/keys";
import { AuthPayload } from "../types/User.type";

export const generateToken = (userId: string, email: string): AuthPayload => {
  return {
    accessToken: jwt.sign({ userId, email }, keys.accessTokenSecret, { expiresIn: "7 days" }),
    refreshAccessToken: jwt.sign({ userId, email }, keys.refreshAccessTokenSecret, { expiresIn: "30 days" }),
    userId
  };
};

export const getUserId = (accessToken: string) => {
  let Auth = accessToken.replace("Bearer", "");
  Auth = Auth.trim();
  const payload: any = jwt.verify(Auth, keys.accessTokenSecret);
  if (payload) {
    const userId = payload.userId.toString();
    return { userId };
  }
  return null;
};
