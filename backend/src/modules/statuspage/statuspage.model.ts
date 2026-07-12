import mongoose, { type Model, Schema, type InferSchemaType } from "mongoose";

const statuspageSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    logoUrl: {
      type: String,
      trim: true,
    },

    serviceIds: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type StatuspageDocument = InferSchemaType<typeof statuspageSchema>;
type StatuspageModel = Model<StatuspageDocument>;

export const Statuspage = mongoose.model<StatuspageDocument, StatuspageModel>(
  "Statuspage",
  statuspageSchema,
);
