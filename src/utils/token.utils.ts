import jwt from "jsonwebtoken";
import { keys } from "../config/keys";
import { AuthPayload } from "../types/User.type";

export const generateToken = (userId: number, email: string): AuthPayload => {
  return {
    accessToken: jwt.sign({ userId, email }, keys.accessTokenSecret, { expiresIn: "7 days" }),
    refreshAccessToken: jwt.sign({ userId, email }, keys.refreshAccessTokenSecret, { expiresIn: "30 days" }),
    userId
  };
};
