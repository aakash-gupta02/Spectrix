import bcrypt from "bcryptjs";
import mongoose, { type Model, Schema, type InferSchemaType } from "mongoose";

const aiCredentials = new Schema({
  enable: {
    type: Boolean,
    default: false,
  },

  provider: {
    type: String,
    enum: ["openai", "anthropic", "ollama", "gemini", "openrouter"],
  },

  apiKey: {
    type: String,
  },

  model: {
    type: String,
  },

  // for ollama
  baseUrl: {
    type: String,
    optional: true,
  },
});

const githubConnection = new Schema({
  connected: {
    type: Boolean,
    default: false,
  },

  accessType: {
    type: String,
    enum: ["oauth", "pat", "app"],
  },

  // Access token for OAuth or Personal Access Token (PAT)
  accessToken: {
    type: String,
  },

  // GitHub App Installation ID
  installationId: {
    type: String,
  },

  // GitHub username associated with the connection
  username: {
    type: String,
  },

  connectedAt: {
    type: Date,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "demo"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: {
      type: String,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    aiCredentials: {
      type: aiCredentials,
    },

    githubConnection: {
      type: githubConnection,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type UserMethods = {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

type UserDocument = InferSchemaType<typeof userSchema> & UserMethods;
type UserModel = Model<UserDocument>;

export const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
