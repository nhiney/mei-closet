import type { Request, Response } from "express";
import { sendFailure, sendSuccess } from "../lib/response.js";
import {
  addWishlist,
  checkWishlist,
  getUserWishlist,
  removeWishlist,
  WishlistServiceError,
} from "../services/wishlistService.js";

function handleError(res: Response, err: unknown): void {
  if (err instanceof WishlistServiceError) {
    sendFailure(res, err.statusCode, err.message);
    return;
  }
  console.error(err);
  sendFailure(res, 500, "Internal server error");
}

export async function addProductToWishlist(req: Request, res: Response) {
  try {
    if (!req.userId) return sendFailure(res, 401, "Unauthorized");
    const { productId } = req.params;
    await addWishlist(req.userId, productId);
    sendSuccess(res, null, 201);
  } catch (err) {
    handleError(res, err);
  }
}

export async function removeProductFromWishlist(req: Request, res: Response) {
  try {
    if (!req.userId) return sendFailure(res, 401, "Unauthorized");
    const { productId } = req.params;
    await removeWishlist(req.userId, productId);
    sendSuccess(res, null);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getWishlist(req: Request, res: Response) {
  try {
    if (!req.userId) return sendFailure(res, 401, "Unauthorized");
    const products = await getUserWishlist(req.userId);
    sendSuccess(res, { items: products });
  } catch (err) {
    handleError(res, err);
  }
}

export async function checkProductFavorite(req: Request, res: Response) {
  try {
    if (!req.userId) return sendFailure(res, 401, "Unauthorized");
    const { productId } = req.params;
    const favorited = await checkWishlist(req.userId, productId);
    sendSuccess(res, { favorited });
  } catch (err) {
    handleError(res, err);
  }
}
