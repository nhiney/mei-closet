import type { Request, Response } from "express";
import { sendFailure, sendSuccess } from "../lib/response.js";
import {
  createOrderService,
  listOrdersService,
  getOrderByIdService,
  cancelOrderService,
  OrderServiceError,
} from "../services/orderService.js";

function handleError(res: Response, err: unknown): void {
  if (err instanceof OrderServiceError) {
    sendFailure(res, err.statusCode, err.message);
    return;
  }
  console.error(err);
  sendFailure(res, 500, "Internal server error");
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const { items, shippingInfo, paymentMethod } = req.body;
    const order = await createOrderService(req.userId, items, shippingInfo, paymentMethod);
    sendSuccess(res, order, 201);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listOrders(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const orders = await listOrdersService(req.userId);
    sendSuccess(res, orders);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const order = await getOrderByIdService(req.params.id, req.userId);
    sendSuccess(res, order);
  } catch (err) {
    handleError(res, err);
  }
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const order = await cancelOrderService(req.params.id, req.userId);
    sendSuccess(res, order);
  } catch (err) {
    handleError(res, err);
  }
}
