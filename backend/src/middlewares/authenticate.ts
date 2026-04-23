import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";

type JwtPayload = { sub?: string };

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const match = header?.match(/^Bearer\s+(\S+)\s*$/i);
  if (!match?.[1]) {
    next(new HttpError(401, "Missing Authorization bearer token", "UNAUTHORIZED"));
    return;
  }

  try {
    const payload = jwt.verify(match[1], env.JWT_SECRET) as JwtPayload;
    const sub = payload.sub;
    if (!sub || !mongoose.Types.ObjectId.isValid(sub)) {
      next(new HttpError(401, "Invalid token", "UNAUTHORIZED"));
      return;
    }
    req.userId = sub;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token", "UNAUTHORIZED"));
  }
};
