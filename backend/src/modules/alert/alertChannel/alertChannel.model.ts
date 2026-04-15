import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Types,
} from "mongoose";

const alertChannelSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["discord", "slack", "webhook"],
      required: true,
    },

    url: {
      type: String, // Encrypted url
      required: true,
    },

    keyVersion: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// indexes
alertChannelSchema.index({ userId: 1, isActive: 1 }); // main query
alertChannelSchema.index({ userId: 1, type: 1 }, { unique: true }); // each user can have only one channel of each type

// Types
export type AlertChannelSchemaType = InferSchemaType<typeof alertChannelSchema>;
export type AlertChannelDocument = HydratedDocument<AlertChannelSchemaType>;
export type AlertChannelEntity = AlertChannelSchemaType & {
  _id: Types.ObjectId;
};

const AlertChannel = mongoose.model<AlertChannelDocument>(
  "AlertChannel",
  alertChannelSchema,
  "alertChannels",
);

export default AlertChannel;
