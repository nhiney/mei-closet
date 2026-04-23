import mongoose, { Schema } from "mongoose";

export const PRODUCT_CONDITIONS = [
  "new",
  "like_new",
  "good",
  "fair",
] as const;

export const PRODUCT_STATUSES = ["available", "sold"] as const;

export const PRODUCT_CATEGORIES = [
  "shirt",
  "pants",
  "shoes",
  "jacket",
  "knitwear",
  "others",
] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const productSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 120, trim: true },
    description: { type: String, default: "", maxlength: 5000, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      required: true,
      index: true,
    },
    size: { type: String, required: true, trim: true, maxlength: 20 },
    condition: {
      type: String,
      enum: PRODUCT_CONDITIONS,
      required: true,
    },
    isKnitwear: {
      type: Boolean,
      default: false,
    },
    knitType: {
      type: String,
      enum: ["scarf", "sweater", "hat", "custom"],
      default: null,
    },
    handmade: {
      type: Boolean,
      default: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: PRODUCT_STATUSES,
      default: "available",
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ ownerId: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1, createdAt: -1 });
productSchema.index({ isKnitwear: 1, status: 1, createdAt: -1 });

export type ProductDoc = mongoose.InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product =
  mongoose.models.Product ??
  mongoose.model<ProductDoc>("Product", productSchema);
