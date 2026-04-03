import mongoose, { Schema, type InferSchemaType } from "mongoose";

const incidentSchema = new Schema(
    {
        endpointId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Endpoint",
            required: true
        },

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["open", "resolved"],
            default: "open"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        resolvedAt: Date,

        failureCount: {
            type: Number,
            default: 3
        }, // Number of failed request after failure 

    }, { timestamps: true });

// indexes
incidentSchema.index(
    { endpointId: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: "open" } }
); // Ensure only one open incident per endpoint

incidentSchema.index({ userId: 1, createdAt: -1 });
incidentSchema.index({ endpointId: 1, createdAt: -1 });
incidentSchema.index({ serviceId: 1, createdAt: -1 });
incidentSchema.index({ userId: 1, serviceId: 1, createdAt: -1 });


// Types
export type IncidentDocument = InferSchemaType<typeof incidentSchema>;

// Export
export const Incident = mongoose.model<IncidentDocument>("Incident", incidentSchema);