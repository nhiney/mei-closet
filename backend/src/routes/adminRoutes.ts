import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { getAdminMetrics } from "../controllers/adminController.js";

export const adminRouter = Router();

// Only admin role allowed
adminRouter.use(authenticate, authorize("admin"));

adminRouter.get("/metrics", asyncHandler(getAdminMetrics));
