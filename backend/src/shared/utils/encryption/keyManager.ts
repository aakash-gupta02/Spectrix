import crypto from "crypto";
import { env } from "../../../core/config/env.js";

export function getKey(version: string) {
  const key = `KEY_${version.toLowerCase()}` as const;
  const rawKey = env[key as keyof typeof env];

  if (!rawKey) {
    throw new Error(`Missing signing key for version ${version}`);
  }

  // normalize to 32 bytes
  return crypto.createHash("sha256").update(String(rawKey)).digest();
}

export function buildKeyPreview(key: string) {
  return key.slice(0, 12) + "****" + key.slice(-4);
}
