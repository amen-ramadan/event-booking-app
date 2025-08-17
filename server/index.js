import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import User from "./models/user.js";
import { createServer } from "http";

const getUserFromAuthHeader = async (auth) => {
  if (!auth) return null;

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user || null;
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return null;
  }
};

const PORT = process.env.PORT || 4000;
const APP_URL = process.env.APP_URL || "*";
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("❌ Missing DB_URL in .env");
  process.exit(1);
}

async function start() {
  await mongoose.connect(DB_URL);
  console.log("✅ MongoDB connected");

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();
  const httpServer = createServer(app);

  app.use(
    cors({
      origin: APP_URL,
      credentials: true,
    })
  );
  app.use(express.json());

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || null;
        const user = await getUserFromAuthHeader(auth);
        return { user };
      },
    })
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("Fatal start error:", err);
  process.exit(1);
});
