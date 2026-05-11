import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

type StreamTokenPayload = {
  serviceId: string;
  userId: string;
  type: "stream";
};

const parseExpiresIn = (value: string): SignOptions["expiresIn"] => {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  return value as SignOptions["expiresIn"];
};


// Access Tokens - Short-lived tokens for authentication
export const createAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: parseExpiresIn(env.JWT_ACCESS_EXPIRES_IN),
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as TokenPayload;
};

// Stream Tokens - Used for real-time communication
export const createStreamToken = (payload: StreamTokenPayload): string => {
  return jwt.sign(payload, env.JWT_STREAM_SECRET as Secret, {
    expiresIn: parseExpiresIn(env.JWT_STREAM_EXPIRES_IN),
  });
};

export const verifyStreamToken = (token: string): StreamTokenPayload => {
  return jwt.verify(token, env.JWT_STREAM_SECRET as Secret) as StreamTokenPayload;
};
