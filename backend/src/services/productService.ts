import mongoose from "mongoose";
import { z } from "zod";
import {
  Product,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  PRODUCT_STATUSES,
} from "../models/Product.js";

export class ProductServiceError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ProductServiceError";
    this.statusCode = statusCode;
  }
}

const sizeSchema = z
  .string()
  .trim()
  .min(1)
  .max(20)
  .regex(/^(S|M|L|XL|\d+(\.\d+)?)$/i, {
    message: "size must be S, M, L, XL, or a number",
  });

const createProductBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(5000).optional().default(""),
  price: z.coerce.number().nonnegative(),
  images: z.array(z.string().url()).min(1).max(10),
  category: z.enum(PRODUCT_CATEGORIES),
  size: sizeSchema,
  condition: z.enum(PRODUCT_CONDITIONS),
  status: z.enum(PRODUCT_STATUSES).optional().default("available"),
  ownerId: z.string().optional(),
  isKnitwear: z.boolean().optional().default(false),
  knitType: z.enum(["scarf", "sweater", "hat", "custom"]).nullable().optional(),
  handmade: z.boolean().optional().default(true),
});

const updateProductBodySchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().max(5000).optional(),
    price: z.coerce.number().nonnegative().optional(),
    images: z.array(z.string().url()).min(1).max(10).optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    size: sizeSchema.optional(),
    condition: z.enum(PRODUCT_CONDITIONS).optional(),
    status: z.enum(PRODUCT_STATUSES).optional(),
    isKnitwear: z.boolean().optional(),
    knitType: z.enum(["scarf", "sweater", "hat", "custom"]).nullable().optional(),
    handmade: z.boolean().optional(),
  })
  .strict();

const listQuerySchema = z.object({
  status: z.enum(PRODUCT_STATUSES).optional(),
  ownerId: z
    .string()
    .optional()
    .refine((v) => !v || mongoose.Types.ObjectId.isValid(v), {
      message: "Invalid ownerId",
    }),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  size: sizeSchema.optional(),
  condition: z.enum(PRODUCT_CONDITIONS).optional(),
  isKnitwear: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
  search: z.string().trim().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(["createdAt_desc", "createdAt_asc", "price_asc", "price_desc"]).default("createdAt_desc"),
});

export type SerializedProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  size: string;
  condition: string;
  isKnitwear?: boolean;
  knitType?: string | null;
  handmade?: boolean;
  ownerId: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
};

export function serializeProductDoc(doc: {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  size: string;
  condition: string;
  isKnitwear?: boolean;
  knitType?: string | null;
  handmade?: boolean;
  ownerId: mongoose.Types.ObjectId;
  status: string;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): SerializedProduct {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    images: doc.images,
    category: doc.category,
    size: doc.size,
    condition: doc.condition,
    isKnitwear: doc.isKnitwear,
    knitType: doc.knitType,
    handmade: doc.handmade,
    ownerId: doc.ownerId.toString(),
    status: doc.status,
    views: doc.views ?? 0,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? doc.createdAt ?? new Date()).toISOString(),
  };
}

export async function listProductsService(query: unknown): Promise<{
  items: SerializedProduct[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}> {
  const q = listQuerySchema.parse(query);
  const filter: Record<string, any> = {};
  
  if (q.status) filter.status = q.status;
  if (q.ownerId) filter.ownerId = q.ownerId;
  if (q.category) filter.category = q.category;
  if (q.size) filter.size = q.size;
  if (q.condition) filter.condition = q.condition;
  if (q.isKnitwear !== undefined) filter.isKnitwear = q.isKnitwear;

  // Search logic (title + description)
  if (q.search) {
    const rx = { $regex: q.search, $options: "i" };
    filter.$or = [{ title: rx }, { description: rx }];
  }

  // Price range logic
  if (q.priceMin !== undefined || q.priceMax !== undefined) {
    filter.price = {};
    if (q.priceMin !== undefined) filter.price.$gte = q.priceMin;
    if (q.priceMax !== undefined) filter.price.$lte = q.priceMax;
  }

  const sortMap: Record<string, any> = {
    createdAt_desc: { createdAt: -1 },
    createdAt_asc: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };
  const sort = sortMap[q.sort] || { createdAt: -1 };
  const skip = (q.page - 1) * q.limit;

  const [total, docs] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sort).skip(skip).limit(q.limit).lean(),
  ]);

  type DocIn = Parameters<typeof serializeProductDoc>[0];
  const items = docs.map((d) =>
    serializeProductDoc(d as unknown as DocIn),
  );

  return {
    items,
    page: q.page,
    limit: q.limit,
    total,
    hasMore: q.page * q.limit < total,
  };
}

export async function getProductByIdService(
  id: string,
): Promise<SerializedProduct> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ProductServiceError(400, "Invalid product id");
  }
  const doc = await Product.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  
  if (!doc) {
    throw new ProductServiceError(404, "Product not found");
  }
  return serializeProductDoc(doc as unknown as Parameters<typeof serializeProductDoc>[0]);
}

export async function createProductService(
  body: unknown,
  ownerId: string,
): Promise<SerializedProduct> {
  const parsed = createProductBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Validation failed";
    throw new ProductServiceError(400, msg);
  }
  const product = await Product.create({
    ...parsed.data,
    ownerId: parsed.data.ownerId || ownerId,
  });

  // Strict check: if isKnitwear is true, knitType must not be null
  if (product.isKnitwear && !product.knitType) {
    await product.deleteOne(); // Cleanup
    throw new ProductServiceError(400, "knitType is required for knitwear products");
  }

  return serializeProductDoc(
    product.toObject() as unknown as Parameters<typeof serializeProductDoc>[0],
  );
}

export async function updateProductService(
  id: string,
  body: unknown,
): Promise<SerializedProduct> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ProductServiceError(400, "Invalid product id");
  }
  const parsed = updateProductBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Validation failed";
    throw new ProductServiceError(400, msg);
  }
  if (Object.keys(parsed.data).length === 0) {
    throw new ProductServiceError(400, "No fields to update");
  }

  const doc = await Product.findById(id);
  if (!doc) {
    throw new ProductServiceError(404, "Product not found");
  }

  Object.assign(doc, parsed.data);
  await doc.save();

  return serializeProductDoc(
    doc.toObject() as unknown as Parameters<typeof serializeProductDoc>[0],
  );
}

export async function deleteProductService(
  id: string,
): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ProductServiceError(400, "Invalid product id");
  }
  const doc = await Product.findById(id);
  if (!doc) {
    throw new ProductServiceError(404, "Product not found");
  }
  await doc.deleteOne();
}
