import "express-serve-static-core";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      userId: string | Types.ObjectId;
      email: string;
      role: string;
    };

    stream?: {
      streamId: string | Types.ObjectId;
      serviceId: string | Types.ObjectId;
      userId: string | Types.ObjectId;
    };

    streamSession?: {
      serviceId: string | Types.ObjectId;
      userId: string | Types.ObjectId;
    };
  }
}
