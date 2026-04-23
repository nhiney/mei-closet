import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { generateProductDescription } from "../controllers/aiController.js";

export const aiRouter = Router();

aiRouter.post(
  "/product-description",
  authenticate,
  asyncHandler(generateProductDescription),
);
