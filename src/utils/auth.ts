// src/utils/auth.ts
import crypto from "crypto";

export const verifySignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  console.log("checking the hash", hash, signature);

  return hash === signature;
};

export const generateSignature = (payload: string, secret: string): string => {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
};
