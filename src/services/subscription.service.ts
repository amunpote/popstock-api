import { prisma } from "@db/prisma.ts";
import * as ShopService from "@services/shop.service.ts";

interface SubscriptionPayload {
  name: string;
  plan_handle: string;
  status: string;
  currency: string;
  interval: string;
  created_at: Date;
  updated_at: Date;
  price: number;
  capped_amount: number;
  admin_graphql_api_shop_id: string;
}

export const createSubscription = async (payload: SubscriptionPayload) => {
  try {
    const shop = await ShopService.getShopByField(
      payload.admin_graphql_api_shop_id,
      "shopify_id",
    );

    if (!shop) {
      throw new Error("Shop not found");
    }

    await prisma.subscriptions_log.create({
      data: {
        plan: payload.name,
        plan_handle: payload.plan_handle,
        status: payload.status,
        currency: payload.currency,
        interval: payload.interval,
        start_date: payload.created_at,
        end_date: payload.updated_at,
        cancelled_date:
          payload.status === "CANCELLED" ? payload.updated_at : null,
        auto_renew: true,
        price: payload.price,
        capped_amount: payload.capped_amount,
        shop_id: shop.id,
      },
    });
  } catch (err: any) {
    throw new Error(err);
  }
};
