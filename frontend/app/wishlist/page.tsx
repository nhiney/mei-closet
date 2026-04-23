"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { fetchWishlist } from "@/lib/api/products";
import { mapApiProductsToFeed } from "@/features/feed/mapApiProductToFeed";
import { FeedProduct } from "@/features/feed/types";
import Link from "next/link";

export default function WishlistPage() {
  const [products, setProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist()
      .then((json) => {
        setProducts(mapApiProductsToFeed(json.data.items));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Saved Treasures
        </h1>
        <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
          Your personal collection of pre-loved pieces.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>Recalling your favorites...</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ color: "var(--error)" }}>{error}</p>
          <Link href="/login" className="mt-4 inline-block text-primary">Log in to view your wishlist</Link>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <span style={{ fontSize: "4rem" }}>📭</span>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "1rem" }}>Your wishlist is empty</h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>Explore the feed to find something you love!</p>
          <Link href="/" style={{ 
            background: "var(--primary)", 
            color: "white", 
            padding: "0.75rem 2rem", 
            borderRadius: "99px",
            fontWeight: 600
          }}>
            Explore Feed
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} masonry />
      )}
    </main>
  );
}
