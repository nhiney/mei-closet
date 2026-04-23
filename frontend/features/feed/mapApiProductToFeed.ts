import type { ApiProduct } from "@/lib/api/types";
import type { FeedProduct } from "./types";

const CONDITIONS: FeedProduct["condition"][] = [
  "new",
  "like_new",
  "good",
  "fair",
];

const STATUSES: FeedProduct["status"][] = ["available", "sold"];

const PLACEHOLDER_IMAGE =
  "https://picsum.photos/seed/mei-placeholder/800/800";

function isCondition(value: string): value is FeedProduct["condition"] {
  return CONDITIONS.includes(value as FeedProduct["condition"]);
}

function isStatus(value: string): value is FeedProduct["status"] {
  return STATUSES.includes(value as FeedProduct["status"]);
}

export function mapApiProductToFeed(product: ApiProduct): FeedProduct | null {
  if (!isCondition(product.condition) || !isStatus(product.status)) {
    return null;
  }

  const imageUrl =
    product.images.find((u) => typeof u === "string" && u.length > 0) ??
    PLACEHOLDER_IMAGE;

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    condition: product.condition,
    status: product.status,
    imageUrl,
    isKnitwear: (product as any).isKnitwear,
    knitType: (product as any).knitType,
    handmade: (product as any).handmade,
    size: product.size,
  };
}

export function mapApiProductsToFeed(products: ApiProduct[]): FeedProduct[] {
  return products
    .map(mapApiProductToFeed)
    .filter((p): p is FeedProduct => p !== null);
}
