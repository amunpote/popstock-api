import { prisma } from "@db/prisma.ts";

export const deleteSessionsByShop = async (shop: string) => {
  try {
    return await prisma.sessions.deleteMany({
      where: {
        shop,
      },
    });
  } catch (err: any) {
    throw new Error(err?.message || String(err));
  }
};
