import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../../core/config/env.js";

export const generateGitHubInstallationUrl = (userId: string) => {
  // 1. Create a state that carries the user's ID (CSRF protection)
  const state = jwt.sign(
    { userId: userId, nonce: crypto.randomBytes(16).toString("hex") },
    env.GITHUB_STATE_SECRET,
    { expiresIn: "10m" },
  );

  // 2. Build the GitHub App installation URL
  const url = new URL(`https://github.com/apps/spectrix-api/installations/new`);

  // 3. Pass the state
  // GitHub will pass this state back to your Setup URL after installation
  url.searchParams.set("state", state);

  return url.toString();
};

export const generateGitHubAuthUrl = (userId: string) => {
  // We generate a NEW state for the OAuth step.
  const oauthState = jwt.sign(
    { userId: userId, nonce: crypto.randomBytes(16).toString("hex") },
    env.GITHUB_STATE_SECRET,
    { expiresIn: "10m" },
  );

  const oauthUrl = new URL("https://github.com/login/oauth/authorize");
  oauthUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  oauthUrl.searchParams.set("redirect_uri", env.GITHUB_CALLBACK_URL);
  oauthUrl.searchParams.set("state", oauthState);

  // We only need read:user here to get their username, the app handles the repo access
  oauthUrl.searchParams.set("scope", "read:user");

  return oauthUrl.toString();
};
