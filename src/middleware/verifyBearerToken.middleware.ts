import "@utils/env.loader.ts";

import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";

export function verifyBearerToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET, {
      algorithms: ["HS256"],
      issuer: "popstock-app",
    });

    next();
  } catch (err: any) {
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({
      error: message,
    });
  }
}
