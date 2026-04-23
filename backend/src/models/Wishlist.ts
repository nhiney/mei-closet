import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate wishlist entries from the same user for the same product
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export type WishlistDoc = mongoose.InferSchemaType<typeof wishlistSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Wishlist =
  mongoose.models.Wishlist ??
  mongoose.model<WishlistDoc>("Wishlist", wishlistSchema);
