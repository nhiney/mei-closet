import mongoose from "mongoose";
import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import { serializeProductDoc, type SerializedProduct } from "./productService.js";

export class WishlistServiceError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "WishlistServiceError";
    this.statusCode = statusCode;
  }
}

export async function addWishlist(userId: string, productId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new WishlistServiceError(400, "Invalid product id");
  }

  const productExists = await Product.exists({ _id: productId });
  if (!productExists) {
    throw new WishlistServiceError(404, "Product not found");
  }

  try {
    await Wishlist.updateOne(
      { userId, productId },
      { $setOnInsert: { userId, productId } },
      { upsert: true }
    );
  } catch (err: unknown) {
    // If a collision somehow happens or another db error, log and throw
    console.error("Wishlist insertion error:", err);
    throw new WishlistServiceError(500, "Could not add to wishlist");
  }
}

export async function removeWishlist(userId: string, productId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new WishlistServiceError(400, "Invalid product id");
  }

  await Wishlist.deleteOne({ userId, productId });
}

export async function getUserWishlist(userId: string): Promise<SerializedProduct[]> {
  const wishlists = await Wishlist.find({ userId })
    .populate("productId")
    .sort({ createdAt: -1 })
    .lean();

  const products = wishlists
    .map(w => w.productId as any)
    .filter(p => p != null);

  return products.map(p => serializeProductDoc(p));
}

export async function checkWishlist(userId: string, productId: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(productId)) return false;
  const count = await Wishlist.countDocuments({ userId, productId });
  return count > 0;
}
