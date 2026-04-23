import { ProductCard } from "./ProductCard";
import type { FeedProduct } from "@/features/feed/types";

export function ProductGrid({ products, masonry = true }: { products: FeedProduct[], masonry?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          No matches found
        </p>
        <p className="mt-2 text-sm text-zinc-300">
          Refine your filters or search to explore our collection.
        </p>
      </div>
    );
  }

  return (
    <div className={masonry ? "masonry-feed" : "product-grid"}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
