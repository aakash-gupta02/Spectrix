import crypto from "crypto";
import { env } from "../config/env.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export const generateGoogleAuthUrl = () => {
  const state = crypto.randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!,
    redirect_uri: env.GOOGLE_REDIRECT_URI!,
    response_type: "code",

    scope: ["openid", "email", "profile"].join(" "),

    access_type: "offline",
    prompt: "consent",
    state,
  });

  return {
    state,
    url: `${GOOGLE_AUTH_URL}?${params.toString()}`,
  };
};
