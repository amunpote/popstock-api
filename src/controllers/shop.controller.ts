import type { Request, Response } from "express";

import { shopify } from "@/app.ts";

import * as ShopService from "@services/shop.service.ts";

import { decryptToken } from "@utils/helpers.ts";

export const createShop = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { sessionId } = req.body;

  let session: any = await shopify.config.sessionStorage.loadSession(sessionId);
  session.accessToken = decryptToken(session.accessToken);

  const client = new shopify.api.clients.Graphql({ session });

  let data = {};

  await client
    .request(
      `
        query shopInfo {
          shop {
            shopOwnerName
            id
            currencyCode
            name
            email
            contactEmail
            marketingSmsConsentEnabledAtCheckout
            primaryDomain {
              url
            }
          }
        }
      `,
    )
    .then((response) => {
      const { shop } = response.data;
      data = shop;
      shop.sessionId = session.id;
      ShopService.createShop(shop);
    })
    .catch((err) => {
      console.log("Error fetching shop details: ", err.message);
      throw new Error(err);
    });

  return res.status(201).json({ success: true, data });
};
