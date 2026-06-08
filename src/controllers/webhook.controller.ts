import type { Response } from "express";

import * as SubscriptionService from "@services/subscription.service.ts";
import * as SessionService from "@services/session.service.ts";

// Uninstalled webhook
export const uninstalled = async (
  req: any,
  res: Response,
): Promise<Response> => {
  try {
    const shop = req.get("X-Shopify-Shop-Domain");
    const topic = req.get("X-Shopify-Topic");
    const payload = req.webhookPayload;

    console.log(
      `Uninstall hook fired for ${shop} on topic: ${topic} with payload -- ${payload}`,
    );

    // sessionQueue.add("uninstallSession", { shop });
    await SessionService.deleteSessionsByShop(shop);

    return res.status(200).send("ok");
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};

// Subscription Update webhook
export const subscriptionUpdate = async (
  req: any,
  res: Response,
): Promise<Response> => {
  try {
    const shop = req.get("X-Shopify-Shop-Domain");
    const topic = req.get("X-Shopify-Topic");
    const payload = req.webhookPayload;

    console.log("Webhook received", { topic, shop, payload });
    SubscriptionService.createSubscription(payload.app_subscription);

    return res.status(200).send("ok");
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};
