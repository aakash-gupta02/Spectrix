import mongoose, {
  Schema,
  type InferSchemaType,
  HydratedDocument,
} from "mongoose";

const dailyStatsSchema = new Schema(
  {
    // references
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

    // data
    date: {
      type: Date,
      required: true,
    },

    // stats
    totalRequests: {
      type: Number,
      default: 0,
    },
    averageResponseTime: {
      type: Number,
      default: 0,
    },
    totalResponseTime: {
      type: Number,
      default: 0,
    },

    // success and failure counts
    successRequests: {
      type: Number,
      default: 0,
    },
    failedRequests: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// indexes
dailyStatsSchema.index({ endpointId: 1, date: 1 }, { unique: true });
dailyStatsSchema.index({ userId: 1, date: 1 });
dailyStatsSchema.index({ serviceId: 1, date: 1 });

// Types
export type DailyStatsSchemaType = InferSchemaType<typeof dailyStatsSchema>;
export type DailyStatsDocument = HydratedDocument<DailyStatsSchemaType>;
export type DailyStatsEntity = DailyStatsSchemaType & {
  _id: mongoose.Types.ObjectId;
};

// Export
export const DailyStats = mongoose.model<DailyStatsSchemaType>(
  "DailyStats",
  dailyStatsSchema,
);
