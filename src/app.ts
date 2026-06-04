import "@/utils/env.loader.ts";

import express from "express";

import { shopifyApp, ApiVersion } from "@shopify/shopify-app-express";
import { PostgreSQLSessionStorage } from "@shopify/shopify-app-session-storage-postgresql";

import { authMiddleware } from "@middleware/auth.middleware.ts";

import webhookRoutes from "@routes/webhooks/index.ts";
import v1Routes from "@routes/v1/index.ts";

export const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SCOPES?.split(","),
    hostScheme: process.env.HOST,
    hostName: process.env.SHOPIFY_API_URL,
    apiVersion: ApiVersion.April26,
  },
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
  },
  sessionStorage: new PostgreSQLSessionStorage(process.env.DATABASE_URL!, {
    sessionTableName: "sessions",
  }),
});

const app = express();

// Shopify webhooks
app.use("/webhooks", webhookRoutes);

// Middleware parse JSON bodies
app.use(express.json());

const port = process.env.PORT || 4000;

app.use("/v1", authMiddleware, v1Routes);

app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
