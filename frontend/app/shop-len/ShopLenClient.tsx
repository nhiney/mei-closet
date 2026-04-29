"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductsList } from "@/lib/api/products";
import { mapApiProductsToFeed } from "@/features/feed/mapApiProductToFeed";
import type { FeedProduct } from "@/features/feed/types";
import styles from "./ShopLenClient.module.css";

/* ── Data ── */
const CATEGORIES = [
  { id: "all",     label: "Tất cả",          count: "12+" },
  { id: "shirt",   label: "Áo Len",           count: "5" },
  { id: "jacket",  label: "Cardigan & Khoác", count: "4" },
  { id: "pants",   label: "Quần Len",         count: "3" },
  { id: "others",  label: "Váy & Phụ kiện",   count: "3" },
];

const COLLECTIONS = [
  {
    id: "shirt",
    name: "Áo Len",
    category: "Knitwear",
    count: "5 sản phẩm",
    image: "/products/shirts/ao-len-1.webp",
  },
  {
    id: "jacket",
    name: "Cardigan",
    category: "Knitwear",
    count: "4 sản phẩm",
    image: "/products/jackets/cadigant-red-1.webp",
  },
  {
    id: "jacket",
    name: "Áo Khoác Len",
    category: "Knitwear",
    count: "4 sản phẩm",
    image: "/products/jackets/jacket-kesoc1.webp",
  },
  {
    id: "pants",
    name: "Quần Len",
    category: "Knitwear",
    count: "3 sản phẩm",
    image: "/products/pants/jeans-wash-rong1.webp",
  },
  {
    id: "others",
    name: "Váy & Phụ kiện",
    category: "Knitwear",
    count: "3 sản phẩm",
    image: "/products/skirts/aufra-1.webp",
  },
];

const TICKER_ITEMS = [
  "Đan Tay Thủ Công",
  "Len Chất Lượng Cao",
  "Miễn Phí Giao Hàng",
  "Đặt Theo Yêu Cầu",
  "100% Handmade",
  "Slow Fashion",
];

const SIZES = ["XS", "S", "M", "L", "XL", "FREESIZE"];
const CONDITIONS = [
  { id: "new",      label: "Mới hoàn toàn" },
  { id: "like_new", label: "Như mới" },
  { id: "good",     label: "Còn tốt" },
  { id: "fair",     label: "Đã qua sử dụng" },
];

/* ── Component ── */
export function ShopLenClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("az");
  const scrollRef = useRef<HTMLDivElement>(null);

  /* drag-scroll for collection row */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const onUp = () => { isDown = false; };
    const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX); };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousedown", onDown); el.removeEventListener("mouseleave", onUp); el.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await fetchProductsList({
          limit: 24,
          sort: "createdAt_desc",
          isKnitwear: true,
          category: activeCategory === "all" ? undefined : (activeCategory as any),
        });
        setProducts(mapApiProductsToFeed(data));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let r = [...products];
    if (selectedSize) {
      r = r.filter(p => {
        const s = p.size?.toUpperCase();
        if (s && SIZES.includes(s)) return s === selectedSize;
        return parseInt(p.id.slice(-1), 16) % SIZES.length === SIZES.indexOf(selectedSize);
      });
    }
    if (selectedCondition) r = r.filter(p => p.condition === selectedCondition);
    if (sortBy === "az")         r.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "za")    r.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortBy === "priceLow")  r.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHigh") r.sort((a, b) => b.price - a.price);
    return r;
  }, [products, selectedSize, selectedCondition, sortBy]);

  return (
    <div className={styles.page}>

      {/* ════════════ HERO ════════════ */}
      <section className={styles.hero}>
        {/* Left dark panel */}
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowLine} />
            Mei Closet · Thủ Công Len
          </div>

          <h1 className={styles.heroTitle}>
            Shop
            <span className={styles.heroTitleAccent}>Len Handmade</span>
          </h1>

          <p className={styles.heroDesc}>
            Từng mũi kim, từng sợi len — được chọn lọc và đan tay tỉ mỉ. Bộ sưu tập len chất lượng cao dành cho người yêu slow fashion.
          </p>

          <div className={styles.heroActions}>
            <Link href="#shop-len-area" className={styles.heroBtnPrimary}>
              Xem bộ sưu tập →
            </Link>
            <Link href="/knit-studio" className={styles.heroBtnSecondary}>
              Knit Studio ✦
            </Link>
          </div>
        </div>

        {/* Right image panel */}
        <div className={styles.heroRight}>
          <img
            src="/products/shirts/ao-len-1.webp"
            alt="Shop Len - Áo len thủ công"
            className={styles.heroImage}
          />
          <div className={styles.heroImageBadge}>New Collection 2025</div>
          <div className={styles.heroScrollHint}>
            <span>Scroll</span>
            <span className={styles.heroScrollLine} />
          </div>
        </div>
      </section>

      {/* ════════════ TICKER ════════════ */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              <span className={styles.tickerDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════ COLLECTIONS ════════════ */}
      <div className={styles.collectionSection}>
        <div className={styles.sectionLabel}>
          <span className={styles.sectionLabelLine} />
          <span className={styles.sectionLabelText}>Danh mục nổi bật</span>
        </div>
        <h2 className={styles.collectionHeading}>
          Khám phá từng<br />dòng sản phẩm
        </h2>
        <div className={styles.collectionScroll} ref={scrollRef}>
          {COLLECTIONS.map((col, i) => (
            <div
              key={i}
              className={styles.collectionCard}
              onClick={() => { setActiveCategory(col.id); document.getElementById("shop-len-area")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ cursor: "pointer" }}
            >
              <img src={col.image} alt={col.name} className={styles.collectionCardImage} />
              <div className={styles.collectionCardFooter}>
                <span className={styles.collectionCardCategory}>{col.category}</span>
                <div className={styles.collectionCardName}>{col.name}</div>
                <span className={styles.collectionCardCount}>{col.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ SHOP AREA ════════════ */}
      <div id="shop-len-area" className={styles.shopArea}>
        {/* Left nav */}
        <nav className={styles.shopNav}>
          <div className={styles.shopNavTitle}>Danh mục</div>
          <ul className={styles.shopNavList}>
            {CATEGORIES.map(cat => (
              <li key={cat.id} className={styles.shopNavItem}>
                <button
                  className={`${styles.shopNavBtn} ${activeCategory === cat.id ? styles.shopNavBtnActive : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                  <span className={styles.shopNavCount}>{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Size filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Kích cỡ</div>
            <div className={styles.filterSizes}>
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`${styles.filterSizeBtn} ${selectedSize === s ? styles.filterSizeBtnActive : ""}`}
                  onClick={() => setSelectedSize(prev => prev === s ? null : s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Condition filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Tình trạng</div>
            <div className={styles.filterConditions}>
              {CONDITIONS.map(c => (
                <button
                  key={c.id}
                  className={`${styles.filterCondBtn} ${selectedCondition === c.id ? styles.filterCondBtnActive : ""}`}
                  onClick={() => setSelectedCondition(prev => prev === c.id ? null : c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main product area */}
        <div className={styles.shopMain}>
          <div className={styles.shopMainHeader}>
            <h2 className={styles.shopMainTitle}>
              {CATEGORIES.find(c => c.id === activeCategory)?.label ?? "Tất cả"}
            </h2>
            <div className={styles.shopMainMeta}>
              <span className={styles.shopMainCount}>{filtered.length} sản phẩm</span>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="priceLow">Giá tăng dần</option>
                <option value="priceHigh">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.productGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} variant="structured" />
              ))}
              {filtered.length === 0 && (
                <p className={styles.emptyState}>
                  Chưa có sản phẩm nào trong danh mục này.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════════════ PULLQUOTE STRIP ════════════ */}
      <div className={styles.quoteStrip}>
        <blockquote className={styles.quoteText}>
          "Mỗi chiếc áo len không chỉ là trang phục — đó là hơi ấm, là tâm huyết, là câu chuyện của người đan."
          <cite className={styles.quoteAuthor}>— Mei Closet · Handmade Since 2023</cite>
        </blockquote>
      </div>

      {/* ════════════ ABOUT ════════════ */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutImageBlock}>
            <img
              src="/products/jackets/cadigant-red-1.webp"
              alt="Câu chuyện Shop Len"
              className={styles.aboutImageMain}
            />
            <img
              src="/products/shirts/ao-len-2.webp"
              alt="Len thủ công"
              className={styles.aboutImageAccent}
            />
          </div>

          <div className={styles.aboutText}>
            <div className={styles.aboutEyebrow}>
              <span className={styles.sectionLabelLine} />
              <span className={styles.aboutEyebrowLabel}>Về Shop Len</span>
            </div>
            <h2 className={styles.aboutHeading}>
              Từng sợi len, một<br />tâm huyết thật sự
            </h2>
            <p className={styles.aboutParagraph}>
              Shop Len ra đời từ tình yêu với nghề đan thủ công. Mỗi sản phẩm đều được chọn lọc từ những cuộn len chất lượng cao, đan tay tỉ mỉ với sự cẩn thận trong từng mũi kim.
            </p>
            <p className={styles.aboutParagraph}>
              Chúng tôi tin vào slow fashion — mặc ít hơn nhưng chất lượng hơn. Mỗi chiếc áo len là một tác phẩm độc bản, không sản xuất đại trà, không vội vàng.
            </p>
            <div className={styles.aboutStats}>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>100%</span>
                <span className={styles.aboutStatLabel}>Đan tay thủ công</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>50+</span>
                <span className={styles.aboutStatLabel}>Mẫu thiết kế</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>2+</span>
                <span className={styles.aboutStatLabel}>Năm hoạt động</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatNumber}>★ 4.9</span>
                <span className={styles.aboutStatLabel}>Đánh giá khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
