import { Keys } from "../types/keys.type";

export const keys: Keys = {
  accessTokenSecret: process.env.accessTokenSecret,
  refreshAccessTokenSecret: process.env.refreshAccessTokenSecret
};

if (!keys.accessTokenSecret || !keys.refreshAccessTokenSecret) {
  throw new Error("Environment Keys not present");
}
