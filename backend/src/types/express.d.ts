import "express-serve-static-core";
import { Types } from "mongoose";
import { StreamTokenPayload } from "../utils/Token.ts";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      userId: string;
      email: string;
      role: string;
    };

    stream: {
      streamId: string;
      serviceId: string;
      userId: string;
    };

    streamSession: StreamTokenPayload;
  }
}
