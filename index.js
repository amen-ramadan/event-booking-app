import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schema/index.js";
import { ApolloServer } from "@apollo/server";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
});

console.log(`🚀  Server ready at: ${url}`);
