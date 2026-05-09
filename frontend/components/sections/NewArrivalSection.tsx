"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { EnhancedSidebarFilter } from "@/components/product/EnhancedSidebarFilter";
import { useLanguage } from "@/context/LanguageContext";
import { fetchProductsList } from "@/lib/api/products";
import { mapApiProductsToFeed } from "@/features/feed/mapApiProductToFeed";
import type { FeedProduct } from "@/features/feed/types";
import styles from "./NewArrivalSection.module.css";

const SIZES = ["0", "1", "2", "3", "4", "5", "FREESIZE"];

interface NewArrivalSectionProps {
  params?: any;
}

export function NewArrivalSection({ params: externalParams }: NewArrivalSectionProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("az");

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await fetchProductsList({ 
          limit: 12, 
          sort: "createdAt_desc",
          isKnitwear: false,
          ...externalParams 
        });
        const mapped = mapApiProductsToFeed(data);
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [externalParams]);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Note: In a real app, 'size' would be a property on FeedProduct.
    // For this demo, we'll simulate filtering by using the product ID's last digit
    // to assign a stable pseudo-size if the property doesn't exist yet.
    // Size filter
    if (selectedSize) {
      result = result.filter(p => {
        const actualSize = p.size?.toUpperCase();
        if (actualSize && SIZES.includes(actualSize)) {
          return actualSize === selectedSize;
        }
        const pseudoSizeIndex = parseInt(p.id.slice(-1), 16) % SIZES.length;
        return SIZES[pseudoSizeIndex] === selectedSize;
      });
    }

    // Condition filter
    if (selectedCondition) {
      result = result.filter(p => p.condition === selectedCondition);
    }

    // Color filter (pseudo-filter since API doesn't return color right now)
    if (selectedColor) {
      result = result.filter(p => {
        // Just spread items randomly across colors for demo purposes
        const pseudoColorIndex = parseInt(p.id.slice(-2, -1) || '0', 16) % 6;
        return pseudoColorIndex === ["black", "white", "beige", "brown", "blue", "red"].indexOf(selectedColor);
      });
    }

    if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "za") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [products, selectedSize, selectedCondition, selectedColor, sortBy]);

  if (loading) return null; // Or a skeleton

  return (
    <section className={styles.section} id="new-arrivals">
      <div className={styles.header}>
        <h2 className={styles.title}>
          {externalParams?.search || externalParams?.category ? "Kết quả tìm kiếm" : t("home.newArrival")}
        </h2>
        <div className={styles.sortWrapper}>
          <select 
            className={styles.sortSelect} 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="az">{t("filter.sortAZ")}</option>
            <option value="za">{t("filter.sortZA")}</option>
            <option value="priceLow">{t("filter.sortPriceLow")}</option>
            <option value="priceHigh">{t("filter.sortPriceHigh")}</option>
          </select>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Filters */}
        <div style={{ position: "sticky", top: "6rem", alignSelf: "start" }}>
          <EnhancedSidebarFilter 
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            selectedCondition={selectedCondition}
            onSelectCondition={setSelectedCondition}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
        </div>

        {/* Main Grid */}
        <div className={styles.main}>
          <div className={styles.grid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="structured" 
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 opacity-50 italic">
              No items matching these filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
