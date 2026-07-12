import mongoose, { type Model, Schema, type InferSchemaType } from "mongoose";

const statuspageSchema = new Schema(
  {
    // Define your schema fields here
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type StatuspageDocument = InferSchemaType<typeof statuspageSchema>;
type StatuspageModel = Model<StatuspageDocument>;

export const Statuspage = mongoose.model<StatuspageDocument, StatuspageModel>("Statuspage", statuspageSchema);
