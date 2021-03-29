/* eslint-disable max-classes-per-file */
import { SchemaDirectiveVisitor } from "apollo-server-express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { getRepository } from "typeorm";
import { GroupMember } from "../entity/GroupMember";
import { LeakyBucket } from "./leakyBucket";
import { getUserId } from "./token.utils";

export class RateLimiter extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { MAX_TOKENS, TOKEN_WINDOW } = this.args;
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const context: ExpressContext = args[2];
      const rateLimit = await LeakyBucket(context.req, MAX_TOKENS, TOKEN_WINDOW, field.name);
      if (rateLimit === false) {
        throw new Error("Rate Limit Exceeded");
      }
      const result = await resolve.apply(this, args);
      return result;
    };
  }
}

export class IsClubMember extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const userId = getUserId(args[2].req.headers.authorization);
      const Args = args[1];
      const groupMember = await getRepository(GroupMember).findOne({ grpId: Args.grpId, userId: userId.userId });
      if (groupMember) {
        const result = await resolve.apply(this, args);
        return result;
      }
      throw new Error("The user has no required permission");
    };
  }
}
