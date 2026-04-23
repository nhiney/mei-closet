import type { Request, Response } from "express";
import { ZodError } from "zod";
import { sendFailure, sendSuccess } from "../lib/response.js";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  listProductsService,
  ProductServiceError,
  updateProductService,
} from "../services/productService.js";

function handleError(res: Response, err: unknown): void {
  if (err instanceof ProductServiceError) {
    sendFailure(res, err.statusCode, err.message);
    return;
  }
  if (err instanceof ZodError) {
    const msg = err.errors.map((e) => e.message).join("; ") || "Invalid request";
    sendFailure(res, 400, msg);
    return;
  }
  console.error(err);
  sendFailure(res, 500, "Internal server error");
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  try {
    const out = await listProductsService(req.query);
    sendSuccess(res, {
      items: out.items,
      page: out.page,
      limit: out.limit,
      total: out.total,
      hasMore: out.hasMore,
    });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await getProductByIdService(req.params.id);
    sendSuccess(res, product);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const product = await createProductService(req.body, req.userId);
    sendSuccess(res, product, 201);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const product = await updateProductService(
      req.params.id,
      req.body,
    );
    sendSuccess(res, product);
  } catch (err) {
    handleError(res, err);
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    await deleteProductService(req.params.id);
    sendSuccess(res, null);
  } catch (err) {
    handleError(res, err);
  }
}
