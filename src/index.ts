import { ApolloServer, ApolloServerExpressConfig, makeExecutableSchema } from "apollo-server-express";
import express from "express";
import { applyMiddleware } from "graphql-middleware";
import { createServer } from "http";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import resolvers from "./graphql/resolvers";
import { RateLimiter } from "./utils/graphql.directives";
import { logger } from "./utils/pino.utils";
import { getUserId } from "./utils/token.utils";

const app = express();
const schemaArray = fileLoader(path.join(__dirname, "./graphql/schema/"));
const typeDefs = mergeTypes(schemaArray);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
      rateLimit: RateLimiter
    }
  })
);

const httpServer = createServer(app);
const config: ApolloServerExpressConfig = {
  schema,
  context: async ctx => {
    const acessToken = ctx.req.headers.authorization;
    if (acessToken) {
      const { userId } = getUserId(acessToken);
      return { ...ctx, userId };
    }
    return { ...ctx };
  }
  // subscriptions: { path: "/subscriptions" }
};

const server = new ApolloServer(config);
server.installSubscriptionHandlers(httpServer);

createConnection()
  .then(async () => {
    logger.info("Postgres Connected!!");
    // app.use("/graphql", express.json(), );
    server.applyMiddleware({ app, path: server.graphqlPath });

    httpServer.listen({ port: 5000 }, async () => {
      logger.info({ filename: "index.ts" }, `Server ready at http://localhost:5000${server.graphqlPath}`);
    });
  })
  .catch(error => logger.error(error));
