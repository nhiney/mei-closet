import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      /** Set by `authenticate` after a valid Bearer JWT. */
      userId?: string;
      /** Full user doc when needed (e.g. admin checks later). */
      user?: { _id: Types.ObjectId; email: string; role: string };
    }
  }
}

export {};
