import { Order, OrderDoc } from "../models/Order.js";
import { Product } from "../models/Product.js";

export class OrderServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "OrderServiceError";
  }
}

export async function createOrderService(
  userId: string,
  items: any[],
  shippingInfo: any,
  paymentMethod: string
): Promise<OrderDoc> {
  if (!items || items.length === 0) {
    throw new OrderServiceError(400, "Order must have at least one item");
  }

  // Calculate total price and verify products exist
  let totalPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new OrderServiceError(404, `Product not found: ${item.productId}`);
    }
    if (product.status === "sold") {
      throw new OrderServiceError(400, `Product already sold: ${product.title}`);
    }
    totalPrice += product.price * (item.quantity || 1);
  }

  const order = new Order({
    userId,
    items,
    shippingInfo,
    paymentMethod,
    totalPrice,
    status: "pending",
  });

  await order.save();

  // For Mei Closet, products might be one-of-a-kind. 
  // Let's mark them as sold once an order is PLACED (or maybe confirmed).
  // For now, let's mark them as sold immediately to avoid double buying.
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, { status: "sold" });
  }

  return order;
}

export async function listOrdersService(userId: string): Promise<OrderDoc[]> {
  return await Order.find({ userId }).sort({ createdAt: -1 });
}

export async function getOrderByIdService(orderId: string, userId: string): Promise<OrderDoc> {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new OrderServiceError(404, "Order not found");
  }
  return order;
}

export async function cancelOrderService(orderId: string, userId: string): Promise<OrderDoc> {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new OrderServiceError(404, "Order not found");
  }

  if (order.status !== "pending") {
    throw new OrderServiceError(400, "Only pending orders can be cancelled");
  }

  order.status = "cancelled";
  await order.save();

  // Restore product status
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, { status: "available" });
  }

  return order;
}
