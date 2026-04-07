import mongoose, { Schema, type InferSchemaType } from "mongoose";

const logSchema = new Schema(
  {
    endpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      required: true,
    },

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

    result: {
      type: String,
      enum: ["success", "failure"],
      required: true,
    },

    statusCode: {
      type: Number,
      min: 100,
      max: 599,
    },

    responseTime: {
      type: Number, // ms
      required: true,
      min: 0,
    },

    errorMessage: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    }, // why not use createdAt? because we want to track when the check was performed, which may differ from when the log was created in the database.
  },
  { timestamps: true },
);

// Indexes
logSchema.index({ userId: 1, checkedAt: -1 });
logSchema.index({ endpointId: 1, checkedAt: -1 }); // for querying logs of an endpoint sorted by time
logSchema.index({ serviceId: 1, checkedAt: -1 }); // for querying logs of a service sorted by time

// TTL index to automatically delete logs older than 30 days
logSchema.index({ checkedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // 30 days

// Types
export type LogDocument = InferSchemaType<typeof logSchema>;

export const Log = mongoose.model<LogDocument>("Log", logSchema);
