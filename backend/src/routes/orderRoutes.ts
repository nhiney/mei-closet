import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createOrder,
  listOrders,
  getOrder,
  cancelOrder,
} from "../controllers/orderController.js";

export const orderRouter = Router();

// All order routes require authentication
orderRouter.use(authenticate);

orderRouter.post("/", asyncHandler(createOrder));
orderRouter.get("/", asyncHandler(listOrders));
orderRouter.get("/:id", asyncHandler(getOrder));
orderRouter.patch("/:id/cancel", asyncHandler(cancelOrder));
