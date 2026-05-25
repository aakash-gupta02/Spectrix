import { StatusCodes } from "http-status-codes";

import ApiError from "../../utils/ApiError.js";
import { createAccessToken } from "../../utils/Token.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { User } from "./user.model.js";

import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
);

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const sanitizeUser = (user: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: string;
}): SafeUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

// Register a new user with email and password
export const registerService = async (payload: RegisterInput) => {
  const existing = await User.findOne({ email: payload.email }).lean();
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "User already exists");
  }

  const hashedPassword = bcrypt.hash(payload.password, 10);
  payload.password = await hashedPassword;

  const user = await User.create(payload);

  const token = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { token, user: sanitizeUser(user) };
};

// Login user with email and password
export const loginService = async (payload: LoginInput) => {
  const user = await User.findOne({ email: payload.email })
    .select("+password")
    .lean();

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Email or password");
  }

  if (user.provider !== "local") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Please login with ${user.provider}`,
    );
  }

  const isValid = await bcrypt.compare(payload.password, user.password!);

  if (!isValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or Password");
  }

  const token = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { token, user: sanitizeUser(user) };
};

// Get current user profile
export const meService = async (userId: string) => {
  const user = await User.findById(userId).select("name email role").lean();
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// Handle Google OAuth callback
export const googleCallbackService = async (
  code: string,
  state: string,
  storedState: string,
) => {
  if (state !== storedState) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OAuth state");
  }

  const { tokens } = await client.getToken(code);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token || "",
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.name) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Google token payload");
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      provider: "google",
      providerId: payload.sub,
    });
  }

  const token = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { token, user: sanitizeUser(user) };
};
