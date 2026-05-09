import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Types,
} from "mongoose";

const streamSchema = new Schema(
  {
    // Stream Details
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
    },

    // Stream Keys
    keyHash: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    keyPreview: {
      type: String,
      required: true,
      trim: true,
    },
    keyVersion: {
      type: String,
      required: true,
    },

    // Owner Detais
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Stream Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// indexes
streamSchema.index({ serviceId: 1, userId: 1 }, { unique: true });
streamSchema.index({ keyHash: 1 });

// Types
export type StreamSchemaType = InferSchemaType<typeof streamSchema>;
export type StreamEntity = StreamSchemaType & { _id: Types.ObjectId };
export type StreamDocument = HydratedDocument<StreamSchemaType>;

// Model
export const Stream = mongoose.model<StreamDocument>("Stream", streamSchema);
