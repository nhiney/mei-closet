"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { fetchProductsList } from "@/lib/api/products";
import { mapApiProductsToFeed } from "@/features/feed/mapApiProductToFeed";
import type { FeedProduct } from "@/features/feed/types";
import styles from "./NewArrivalSection.module.css";

const SIZES = ["S", "M", "L", "XL", "FREESIZE"];
const CONDITIONS = [
  { id: "new", vi: "Mới", en: "New" },
  { id: "like_new", vi: "Như mới", en: "Like New" },
  { id: "good", vi: "Tốt", en: "Good" },
];

interface NewArrivalSectionProps {
  params?: any;
}

export function NewArrivalSection({ params: externalParams }: NewArrivalSectionProps) {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("az");

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await fetchProductsList({
          limit: 12,
          sort: "createdAt_desc",
          isKnitwear: false,
          ...externalParams,
        });
        setProducts(mapApiProductsToFeed(data));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [externalParams]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedSize) {
      result = result.filter(p => {
        const s = p.size?.toUpperCase();
        return s === selectedSize || (!s && parseInt(p.id.slice(-1), 16) % SIZES.length === SIZES.indexOf(selectedSize));
      });
    }
    if (selectedCondition) {
      result = result.filter(p => p.condition === selectedCondition);
    }
    if (sortBy === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "za") result.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortBy === "priceLow") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHigh") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, selectedSize, selectedCondition, sortBy]);

  const isSearching = externalParams?.search || externalParams?.category;
  const sectionTitle = isSearching ? (language === "vi" ? "Kết quả tìm kiếm" : "Search results") : t("home.newArrival");

  if (loading) return null;

  return (
    <section className={styles.section} id="new-arrivals">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>{sectionTitle}</h2>
          <span className={styles.count}>{filtered.length} {language === "vi" ? "sản phẩm" : "items"}</span>
        </div>
        <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="az">{t("filter.sortAZ")}</option>
          <option value="za">{t("filter.sortZA")}</option>
          <option value="priceLow">{t("filter.sortPriceLow")}</option>
          <option value="priceHigh">{t("filter.sortPriceHigh")}</option>
        </select>
      </div>

      {/* Filter chips */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>{language === "vi" ? "Size:" : "Size:"}</span>
        {SIZES.map(size => (
          <button
            key={size}
            className={`${styles.chip} ${selectedSize === size ? styles.chipActive : ""}`}
            onClick={() => setSelectedSize(selectedSize === size ? null : size)}
          >
            {size}
          </button>
        ))}
        <span className={styles.filterDivider} />
        <span className={styles.filterLabel}>{language === "vi" ? "Tình trạng:" : "Condition:"}</span>
        {CONDITIONS.map(c => (
          <button
            key={c.id}
            className={`${styles.chip} ${selectedCondition === c.id ? styles.chipActive : ""}`}
            onClick={() => setSelectedCondition(selectedCondition === c.id ? null : c.id)}
          >
            {language === "vi" ? c.vi : c.en}
          </button>
        ))}
        {(selectedSize || selectedCondition) && (
          <button className={styles.clearBtn} onClick={() => { setSelectedSize(null); setSelectedCondition(null); }}>
            {language === "vi" ? "Xoá bộ lọc" : "Clear filters"}
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className={styles.grid}>
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} variant="structured" />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          {language === "vi" ? "Không có sản phẩm phù hợp." : "No items match these filters."}
        </div>
      )}
    </section>
  );
}
