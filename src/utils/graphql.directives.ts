import { SchemaDirectiveVisitor } from "apollo-server-express";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { LeakyBucket } from "./leakyBucket";

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
