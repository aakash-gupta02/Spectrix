import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";
import { createAccessToken, createRefreshToken } from "../../shared/utils/Token.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { User } from "./user.model.js";

import { OAuth2Client } from "google-auth-library";
import { env } from "../../core/config/env.js";
import bcrypt from "bcryptjs";
import { Service } from "../service/service.model.js";

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

  const accessToken = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  const refreshToken = createRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "refresh",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken, user: sanitizeUser(user) };
};

// Login user with email and password
export const loginService = async (payload: LoginInput) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

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

  const accessToken = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  const refreshToken = createRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "refresh",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken, user: sanitizeUser(user) };
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
  let RedirectPath = "/dashboard";
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

  const serviceExist = await Service.findOne({ userId: user._id });
  if (!serviceExist) RedirectPath = "/dashboard/services";

  const accessToken = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  const refreshToken = createRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "refresh",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken, redirectPath: RedirectPath };
};

// Logout the user by clearing the authentication cookie
export const logoutService = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: "" } },
    { new: true },
  );

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
};

// Refresh access token using refresh token
export const refreshTokensService = async (
  userId: string,
  refreshToken: string,
) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user || !user.refreshToken) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "User not found or not logged in",
    );
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const newAccessToken = createAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  });

  return { accessToken: newAccessToken };
};
