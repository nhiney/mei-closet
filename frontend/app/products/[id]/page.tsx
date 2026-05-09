import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById, fetchProductsList } from "@/lib/api/products";
import { mapApiProductToFeed, mapApiProductsToFeed } from "@/features/feed/mapApiProductToFeed";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `Buy ${product.title} on Mei Closet.`,
    openGraph: {
      title: product.title,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const apiProduct = await fetchProductById(id);
  if (!apiProduct) notFound();

  const product = mapApiProductToFeed(apiProduct);
  if (!product) notFound();

  // Fetch related products (same category, excluding current)
  let relatedProducts: import("@/features/feed/types").FeedProduct[] = [];
  try {
    const { data } = await fetchProductsList({
      category: apiProduct.category as any,
      limit: 4,
    });
    relatedProducts = mapApiProductsToFeed(data).filter((p) => p.id !== id);
  } catch {
    // Silently fail — related products are non-critical
  }

  return (
    <ProductDetailClient
      apiProduct={apiProduct}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
