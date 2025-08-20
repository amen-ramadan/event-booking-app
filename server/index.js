// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { createServer } from "http";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import User from "./models/user.js";

// WebSocket + Subscriptions (graphql-ws)
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

const PORT = process.env.PORT || 4000;
const APP_URL = process.env.APP_URL || "*";
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("❌ Missing DB_URL in .env");
  process.exit(1);
}

// --- Auth helper (HTTP + WS) ---
const getUserFromTokenish = async (authOrToken) => {
  if (!authOrToken) return null;
  const token = authOrToken.startsWith?.("Bearer ")
    ? authOrToken.slice(7)
    : authOrToken;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user || null;
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return null;
  }
};

async function start() {
  // 1) DB
  await mongoose.connect(DB_URL);
  console.log("✅ MongoDB connected");

  // 2) GraphQL schema (typeDefs + resolvers)
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 3) Express + HTTP server
  const app = express();
  const httpServer = createServer(app);

  // CORS + JSON
  app.use(
    cors({
      origin: APP_URL,
      credentials: true,
    })
  );
  app.use(express.json());

  // 4) WebSocket server (على نفس /graphql)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
    // اختياري: perMessageDeflate: false,
  });

  // 5) اربط graphql-ws بالسكيما ومرّر كونتكست للمصادقة
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx /*, msg, args */) => {
        // حاول أخذ التوكن من connectionParams (الطريقة الموصى بها للمتصفّح)
        const params = ctx.connectionParams || {};
        const authFromParams =
          params.Authorization || params.authorization || params.token || null;

        // fallback: من هيدرز طلب الـ Upgrade (غالباً non-browser)
        const authFromHeaders =
          ctx.extra?.request?.headers?.authorization || null;

        const user = await getUserFromTokenish(
          authFromParams || authFromHeaders
        );
        return { user };
      },
    },
    wsServer
  );

  // 6) Apollo Server (HTTP)
  const server = new ApolloServer({
    schema,
    // درين للسيرفرين (HTTP + WS)
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // 7) إقلاع Apollo + ربط ميدلوير Express على /graphql
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || null;
        const user = await getUserFromTokenish(auth);
        return { user };
      },
    })
  );

  // 8) استماع HTTP + WS
  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP & WS ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("Fatal start error:", err);
  process.exit(1);
});
