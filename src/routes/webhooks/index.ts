import express from "express";

import * as webhookController from "@controllers/webhook.controller.ts";
import { verifyShopifyWebhook } from "@utils/helpers.ts";

const router = express.Router();

const rawJson = express.raw({ type: "application/json" });

router.post(
  "/uninstalled",
  rawJson,
  verifyShopifyWebhook,
  webhookController.uninstalled,
);

router.post(
  "/subscriptions/update",
  rawJson,
  verifyShopifyWebhook,
  webhookController.subscriptionUpdate,
);

router.post(
  "/settings/update",
  rawJson,
  verifyShopifyWebhook,
  webhookController.subscriptionUpdate,
);

export default router;
