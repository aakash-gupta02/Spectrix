import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../../core/config/env.js";

export const generateGitHubAuthUrl = (userId: string) => {
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
