import { ApolloServer, ApolloServerExpressConfig, makeExecutableSchema } from "apollo-server-express";
import express from "express";
import { applyMiddleware } from "graphql-middleware";
import { createServer } from "http";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import resolvers from "./graphql/resolvers";
import { LeakyBucket } from "./utils/leakyBucket";
import { logger } from "./utils/pino.utils";

const app = express();
const schemaArray = fileLoader(path.join(__dirname, "./graphql/schema/"));
const typeDefs = mergeTypes(schemaArray);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers
  })
);

const httpServer = createServer(app);
const config: ApolloServerExpressConfig = {
  schema,
  context: async ctx => {
    return { ...ctx };
  }
  // subscriptions: { path: "/subscriptions" }
};

const server = new ApolloServer(config);
server.installSubscriptionHandlers(httpServer);

createConnection()
  .then(async () => {
    logger.info("Postgres Connected");
    app.use("/graphql", express.json(), LeakyBucket);
    server.applyMiddleware({ app, path: server.graphqlPath });

    httpServer.listen({ port: 3000 }, async () => {
      logger.info({ filename: "index.ts" }, `Server ready at http://localhost:3000${server.graphqlPath}`);
    });
  })
  .catch(error => logger.error(error));
