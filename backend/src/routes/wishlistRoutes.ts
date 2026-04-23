import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import {
  addProductToWishlist,
  checkProductFavorite,
  getWishlist,
  removeProductFromWishlist,
} from "../controllers/wishlistController.js";

export const wishlistRouter = Router();

const userOnly = [authenticate, authorize("user")];

wishlistRouter.get("/", userOnly, asyncHandler(getWishlist));
wishlistRouter.get("/check/:productId", userOnly, asyncHandler(checkProductFavorite));
wishlistRouter.post("/:productId", userOnly, asyncHandler(addProductToWishlist));
wishlistRouter.delete("/:productId", userOnly, asyncHandler(removeProductFromWishlist));
