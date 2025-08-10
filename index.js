import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schema/index.js";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  context: async ({ req }) => {
    const auth = req?.headers?.authorization || null;
    if (auth && auth.startsWith("Bearer ")) {
      try {
        const token = auth.slice(7);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id);
        return { user };
      } catch (err) {
        console.error("JWT ERROR:", err);
        return {};
      }
    }
    return {};
  },
});

console.log(`🚀  Server ready at: ${url}`);
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
