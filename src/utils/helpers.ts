import "@utils/env.loader.ts";
import crypto from "node:crypto";

import type { Response, NextFunction } from "express";

// Configuration constants
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard for GCM

/**
 * Retrieves and validates the encryption key from environment variables.
 */
function getEncryptionKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_SECRET;
  if (!hexKey) {
    throw new Error("SESSION_ENCRYPTION_KEY environment variable is missing.");
  }
  const key = Buffer.from(hexKey, "hex");
  if (key.length !== 32) {
    throw new Error(
      "SESSION_ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters).",
    );
  }
  return key;
}

/**
 * Encrypts a plaintext session token.
 * Output format: iv_hex:auth_tag_hex:encrypted_text_hex
 */
export function encryptToken(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // Combine elements using a delimiter for easy parsing during decryption
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted session token string.
 */
export function decryptToken(encryptedData: string): string {
  const key = getEncryptionKey();

  // Split the combined components
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format.");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export const verifyShopifyWebhook = (
  req: any,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
    const digest = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET!)
      .update(req.body)
      .digest("base64");

    const isTimingSafeEqual = crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(hmacHeader),
    );

    if (!isTimingSafeEqual) {
      return res.status(401).send("Invalid HMAC");
    }

    req.webhookPayload = JSON.parse(req.body.toString("utf8"));
    return next();
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};
