import mongoose, { Schema, type InferSchemaType } from "mongoose";

const endpointSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 50
        },

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        path: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (value: string) => /^\/[a-zA-Z0-9\-\/]*$/.test(value),
                message: "Invalid path format"
            }
        },

        method: {
            type: String,
            enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            required: true
        },

        query: {
            type: Map,
            of: String,
            default: {}
        },

        headers: {
            type: Map,
            of: String,
            default: {}
        },

        body: {
            type: Schema.Types.Mixed,
        },

        interval: {
            type: Number, // seconds
            default: 300, // 5 minutes
            min: 10 // 10 seconds
        },

        timeout: {
            type: Number, // ms
            default: 5000,
            min: 1000, // 1 second
            max: 60000 // 1 minute
        },

        expectedStatus: {
            type: [Number],
            default: [200]
        },

        retries: {
            type: Number,
            default: 1
        },

        active: {
            type: Boolean,
            default: true
        },

        lastCheckedAt: Date,

        nextCheckAt: Date
    },
    { timestamps: true }
);

// indexes
endpointSchema.index({ serviceId: 1 });
endpointSchema.index(
    { serviceId: 1, path: 1, method: 1 },
    { unique: true }
); // Ensure unique endpoint paths per service and method

export type EndpointDocument = InferSchemaType<typeof endpointSchema>;

export const Endpoint = mongoose.model<EndpointDocument>(
    "Endpoint",
    endpointSchema
);