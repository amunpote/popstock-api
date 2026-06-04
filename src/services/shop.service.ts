import { prisma } from "@db/prisma.ts";

interface Shop {
  id: string;
  shopOwnerName: string;
  email: string;
  contactEmail: string;
  currencyCode: string;
  marketingSmsConsentEnabledAtCheckout: boolean;
  sessionId: string;
  name: string;
  primaryDomain: {
    url: string;
  };
}

export const createShop = async (shop: Shop) => {
  try {
    await prisma.shop.upsert({
      where: {
        shopify_id: shop.id,
      },
      update: {
        shop_title: shop.name,
        owner_name: shop.shopOwnerName,
        owner_email: shop.email,
        contact_email: shop.contactEmail,
        currency: shop.currencyCode,
        marketing_consent: shop.marketingSmsConsentEnabledAtCheckout,
        session_id: shop.sessionId,
        updated_at: new Date(),
      },
      create: {
        primary_domain: shop.primaryDomain.url,
        shopify_id: shop.id,
        shop_title: shop.name,
        owner_name: shop.shopOwnerName,
        owner_email: shop.email,
        contact_email: shop.contactEmail,
        currency: shop.currencyCode,
        marketing_consent: shop.marketingSmsConsentEnabledAtCheckout,
        session_id: shop.sessionId,
      },
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getShopByField = async (
  field_value: any,
  field = "primary_domain",
) => {
  try {
    const where = { [field]: field_value };
    return await prisma.shop.findFirst({ where });
  } catch (err: any) {
    throw new Error(err);
  }
};
