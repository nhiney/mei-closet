import { getPublicApiBaseUrl } from "@/lib/env";
import type { ApiProduct } from "./types";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  } as const;
}

export async function fetchWishlistCheck(
  token: string,
  productId: string,
): Promise<boolean> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/wishlist/check/${encodeURIComponent(productId)}`,
    { headers: authHeaders(token), cache: "no-store" },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean; data?: { favorited?: boolean } };
  return Boolean(data.data?.favorited);
}

export async function addWishlist(
  token: string,
  productId: string,
): Promise<void> {
  const res = await fetch(`${getPublicApiBaseUrl()}/wishlist/${encodeURIComponent(productId)}`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Could not save to wishlist");
  }
}

export async function removeWishlist(
  token: string,
  productId: string,
): Promise<void> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/wishlist/${encodeURIComponent(productId)}`,
    { method: "DELETE", headers: authHeaders(token) },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Could not remove from wishlist");
  }
}

export async function fetchWishlist(token: string): Promise<ApiProduct[]> {
  const res = await fetch(`${getPublicApiBaseUrl()}/wishlist`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Could not fetch wishlist");
  }
  const json = await res.json() as { success: boolean; data: { items: ApiProduct[] } };
  return json.data.items || [];
}
