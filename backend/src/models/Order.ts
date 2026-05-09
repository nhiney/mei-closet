import mongoose, { Schema } from "mongoose";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  imageUrl: { type: String, required: true },
});

const shippingInfoSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  note: { type: String },
});

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    shippingInfo: { type: shippingInfoSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "momo"],
      required: true,
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export type OrderDoc = mongoose.InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Order =
  mongoose.models.Order ?? mongoose.model<OrderDoc>("Order", orderSchema);
