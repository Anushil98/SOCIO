import { ApolloServer, ApolloServerExpressConfig, makeExecutableSchema } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { applyMiddleware } from "graphql-middleware";
import { createServer } from "http";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";
import multer from "multer";
import path from "path";
import "reflect-metadata";
import { createConnection, getCustomRepository } from "typeorm";
import { uploadMiddleware } from "./controllers/FileUpload/FileUpload";
import resolvers from "./graphql/resolvers";
import { SearchRepository } from "./Repositories/SearchRepository";
import { IsClubMember, RateLimiter } from "./utils/graphql.directives";
import { logger } from "./utils/pino.utils";
import { getUserId } from "./utils/token.utils";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });
app.post("/Upload", cors(), upload.array("files", 4), uploadMiddleware);
app.get("/asset", (req, res) => {
  const { name, type } = req.query;
  if (type === "HighRes") {
    return res.sendFile(path.resolve(`public/files/HighRes/${name}.jpeg`));
  }
  if (type === "LowRes") {
    return res.sendFile(path.resolve(`public/files/LowRes/${name}.jpeg`));
  }
  if (type === "LowestRes") {
    return res.sendFile(path.resolve(`public/files/LowestRes/${name}.jpeg`));
  }
  return res.send("No File Found").status(404);
});

const schemaArray = fileLoader(path.join(__dirname, "./graphql/schema/"));
const typeDefs = mergeTypes(schemaArray);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
      rateLimit: RateLimiter,
      isClubMember: IsClubMember
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

    if (process.argv.join(" ").indexOf("FillSearch") >= 0) {
      logger.info("Search Filling started");
      getCustomRepository(SearchRepository)
        .fillTable()
        .then(() => {
          console.log("Search Filling completed");
        })
        .catch(err => {
          logger.error(err);
        });
    }
  })
  .catch(error => logger.error(error));
