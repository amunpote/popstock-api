import type { Request, Response, NextFunction } from "express";

import { shopify } from "@/app.ts";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    // Decode and verify the JWT
    const payload = await shopify.api.session.decodeSessionToken(token);
    const shop = payload.dest.replace("https://", ""); // "felvo-app-2.myshopify.com"

    // Load session from DB
    const sessionId = shopify.api.session.getOfflineId(shop);
    const session = await shopify.config.sessionStorage.loadSession(sessionId);

    if (!session) {
      res.status(401).json({ error: "Session not found" });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
