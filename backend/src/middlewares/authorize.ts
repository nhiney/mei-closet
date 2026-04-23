import type { RequestHandler } from "express";
import { User } from "../models/User.js";
import { HttpError } from "../lib/httpError.js";

/**
 * Role-based authorization middleware.
 * Must be used AFTER the `authenticate` middleware.
 */
export function authorize(...roles: string[]): RequestHandler {
  return async (req, _res, next) => {
    try {
      if (!req.userId) {
        return next(new HttpError(401, "Not authenticated", "UNAUTHORIZED"));
      }

      // Fetch user role
      const user = await User.findById(req.userId).select("role email");
      if (!user) {
        return next(new HttpError(401, "User not found", "UNAUTHORIZED"));
      }

      // Check if user has required role
      if (!roles.includes(user.role)) {
        return next(new HttpError(403, `Access denied. Requires one of roles: ${roles.join(", ")}`, "FORBIDDEN"));
      }

      // Optionally attach user info to request
      req.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}
