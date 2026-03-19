import mongoose, { type Model, Schema, type InferSchemaType } from "mongoose";

const serviceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            min: 1,
            max: 50
        },
        description: {
            type: String,
            trim: true,
            max: 100
        },

        baseUrl: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (value: string) {
                    try {
                        const url = new URL(value);
                        return url.pathname === "/" || url.pathname === "";
                    } catch {
                        return false;
                    }
                },
                message: "Invalid base URL"
            }
        },

        environment: {
            type: String,
            enum: ["production", "staging", "development"],
            default: "development"
        },

        active: {
            type: Boolean,
            default: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }

    }, { timestamps: true }
);


// indexes
serviceSchema.index({ userId: 1 });
serviceSchema.index({ userId: 1, name: 1 }, { unique: true }); // Ensure unique service names per user


// Types
export type ServiceDocument = InferSchemaType<typeof serviceSchema>;

export const Service = mongoose.model<ServiceDocument>("Service", serviceSchema);