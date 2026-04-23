import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/productController.js";

/**
 * Product resource — mounted at /api/products
 */
export const productsRouter = Router();

// Public routes (or read-only user access depending on needs, but typically public for marketplace)
productsRouter.get("/", asyncHandler(listProducts));
productsRouter.get("/:id", asyncHandler(getProduct));

// Admin-only routes
const adminOnly = [authenticate, authorize("admin")];

productsRouter.post("/", adminOnly, asyncHandler(createProduct));
productsRouter.put("/:id", adminOnly, asyncHandler(updateProduct));
productsRouter.delete("/:id", adminOnly, asyncHandler(deleteProduct));
