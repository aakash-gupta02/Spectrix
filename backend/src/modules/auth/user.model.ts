import bcrypt from "bcryptjs";
import mongoose, { type Model, Schema, type InferSchemaType } from "mongoose";

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
