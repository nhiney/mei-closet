import { getPublicApiBaseUrl } from "@/lib/env";
import { loadSession } from "../auth/session";
import { LOCAL_PRODUCTS } from "../localProducts";
import type {
  ApiErrorBody,
  ApiFailureBody,
  ApiProduct,
  ApiProductsListResponse,
  CreateProductRequest,
  ApiResponse,
} from "./types";

export class UnauthorizedError extends Error {
  constructor() {
    super("Session expired. Please log in again.");
    this.name = "UnauthorizedError";
  }
}

async function readErrorMessage(res: Response): Promise<string> {
  let message = `Request failed (${res.status})`;
  try {
    const body = (await res.json()) as
      | ApiErrorBody
      | ApiFailureBody
      | Record<string, unknown>;
    if (
      typeof body === "object" &&
      body &&
      "success" in body &&
      body.success === false &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      return body.message;
    }
    const err = body as ApiErrorBody;
    if (err?.error?.message) return err.error.message;
  } catch {
    /* ignore */
  }
  return message;
}

export type ListProductsParams = {
  page?: number;
  limit?: number;
  status?: "available" | "sold";
  ownerId?: string;
  category?: "shirt" | "pants" | "shoes" | "jacket" | "knitwear" | "others";
  isKnitwear?: boolean;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: "createdAt_desc" | "createdAt_asc" | "price_asc" | "price_desc";
};

function buildQuery(params: ListProductsParams): string {
  const search = new URLSearchParams();
  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.ownerId) search.set("ownerId", params.ownerId);
  if (params.category) search.set("category", params.category);
  if (params.isKnitwear !== undefined) search.set("isKnitwear", String(params.isKnitwear));
  if (params.search) search.set("search", params.search);
  if (params.priceMin != null) search.set("priceMin", String(params.priceMin));
  if (params.priceMax != null) search.set("priceMax", String(params.priceMax));
  if (params.sort) search.set("sort", params.sort);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

type ListSuccess = {
  success: true;
  data: {
    items: ApiProduct[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

export async function fetchProductsList(
  params: ListProductsParams = {},
): Promise<ApiProductsListResponse> {
  const base = getPublicApiBaseUrl();
  const url = `${base}/products${buildQuery(params)}`;

  let apiItems: ApiProduct[] = [];
  let apiMeta = { page: 1, limit: 20, total: 0, hasMore: false };

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = (await res.json()) as ListSuccess | ApiFailureBody;
      if ("success" in json && json.success) {
        apiItems = json.data.items;
        apiMeta = {
          page: json.data.page,
          limit: json.data.limit,
          total: json.data.total,
          hasMore: json.data.hasMore,
        };
      }
    }
  } catch (err) {
    console.error("API Fetch Error (using local fallback):", err);
  }
  
  // Merge local products that match filters
  let items = [...apiItems];
  
  // Simple local filter for demonstration
  const filteredLocal = LOCAL_PRODUCTS.filter(p => {
    if (params.isKnitwear !== undefined && (p as any).isKnitwear !== params.isKnitwear) return false;
    if (params.category && p.category !== params.category) return false;
    if (params.search && !p.title.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });

  if (params.page === 1 || !params.page) {
    items = [...filteredLocal, ...items];
  }

  return {
    data: items,
    meta: {
      ...apiMeta,
      total: apiMeta.total + filteredLocal.length,
    },
  };
}

type ProductSuccess = { success: true; data: ApiProduct };

export async function fetchProductById(id: string): Promise<ApiProduct | null> {
  // Check local products first
  const local = LOCAL_PRODUCTS.find(p => p.id === id);
  if (local) return local;

  const base = getPublicApiBaseUrl();
  const url = `${base}/products/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  const json = (await res.json()) as ProductSuccess | ApiFailureBody;
  if (!("success" in json) || !json.success) {
    throw new Error(
      "success" in json && !json.success ? json.message : "Invalid response",
    );
  }
  return json.data;
}

export async function apiCreateProduct(
  accessToken: string,
  body: CreateProductRequest,
): Promise<{ product: ApiProduct }> {
  const base = getPublicApiBaseUrl();
  const res = await fetch(`${base}/products`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError();
    }
    throw new Error(await readErrorMessage(res));
  }

  const json = (await res.json()) as ProductSuccess | ApiFailureBody;
  if (!("success" in json) || !json.success) {
    throw new Error(
      "success" in json && !json.success ? json.message : "Invalid response",
    );
  }
  return { product: json.data };
}

// Wishlist API
export async function toggleWishlist(productId: string, isFavorited: boolean): Promise<boolean> {
  const session = loadSession();
  
  // Handle local products OR guest users
  if (productId.startsWith("local-") || !session) {
    try {
      const saved = localStorage.getItem("mei-closet-local-wishlist");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (isFavorited) {
        list = list.filter(id => id !== productId);
      } else {
        if (!list.includes(productId)) {
          list.push(productId);
        }
      }
      localStorage.setItem("mei-closet-local-wishlist", JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  }

  const method = isFavorited ? "DELETE" : "POST";
  const res = await fetch(`${getPublicApiBaseUrl()}/wishlist/${productId}`, {
    method,
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return res.ok;
}

export async function fetchWishlist(): Promise<ApiResponse<{ items: ApiProduct[] }>> {
  let apiItems: ApiProduct[] = [];
  
  try {
    const session = loadSession();
    if (session) {
      const res = await fetch(`${getPublicApiBaseUrl()}/wishlist`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        apiItems = json.data.items;
      }
    }
  } catch (err) {
    console.error("Failed to fetch API wishlist:", err);
  }

  // Add local products from local wishlist
  try {
    const saved = localStorage.getItem("mei-closet-local-wishlist");
    if (saved) {
      const list: string[] = JSON.parse(saved);
      const localItems = LOCAL_PRODUCTS.filter(p => list.includes(p.id));
      apiItems = [...localItems, ...apiItems];
    }
  } catch (err) {
    console.error("Failed to load local wishlist:", err);
  }

  return {
    success: true,
    data: { items: apiItems },
  };
}

export async function checkIsFavorited(productId: string): Promise<boolean> {
  // Handle local products
  if (productId.startsWith("local-")) {
    try {
      const saved = localStorage.getItem("mei-closet-local-wishlist");
      if (!saved) return false;
      const list: string[] = JSON.parse(saved);
      return list.includes(productId);
    } catch {
      return false;
    }
  }

  const session = loadSession();
  if (!session) return false;

  const res = await fetch(`${getPublicApiBaseUrl()}/wishlist/check/${productId}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  if (!res.ok) return false;
  const json = await res.json();
  return json.data.favorited;
}
