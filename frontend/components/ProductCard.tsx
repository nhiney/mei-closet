"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { WishlistButton } from "@/components/WishlistButton";
import { QuickView } from "@/components/QuickView";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { formatUsd } from "@/lib/format";
import type { FeedProduct } from "@/features/feed/types";
import styles from "./ProductCard.module.css";

const conditionLabel: Record<FeedProduct["condition"], string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

type ProductCardProps = {
  product: FeedProduct;
  variant?: "pinterest" | "structured";
};

export function ProductCard({ product, variant = "pinterest" }: ProductCardProps) {
  const { id, title, price, status, imageUrl, isKnitwear } = product;
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { requireAuth, showLoginPrompt, closeLoginPrompt } = useRequireAuth();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const sold = status === "sold";
  const free = price === 0;

  // Pinterest Style aspect ratio
  const pinterestAspectRatio = useMemo(() => {
    const ratios = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-[1/1]"];
    const index = parseInt(id.slice(-1), 16) % ratios.length;
    return ratios[index];
  }, [id]);

  if (variant === "structured") {
    return (
      <>
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        productTitle={title}
        productImage={imageUrl}
        action="cart"
      />
      <div className={styles.structuredCard}>
        <div className={styles.structuredImageContainer}>
          <Link href={`/products/${id}`}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className={styles.structuredImage}
            />
          </Link>
          
          {/* New Drop Badge (Pink) - Assuming items without sold status in "New arrivals" are new drops */}
          {!sold && !isKnitwear && (
            <span className={styles.newDropBadge}>{t("product.newDrop")}</span>
          )}

          {/* Sold Out Badge (White) */}
          {sold && (
            <span className={styles.soldOutBadge}>{t("product.soldOut")}</span>
          )}

          {/* Top Right Icons */}
          <div className={styles.topRightIcons}>
            <button className={styles.iconCircle} title="Wishlist">
              <HeartIcon />
            </button>
            <button className={styles.iconCircle} title="Quick view" onClick={() => setQuickViewOpen(true)}>
              <ZoomIcon />
            </button>
          </div>

          {/* Hover Action: Add to Cart */}
          {!sold && (
            <div className={styles.hoverActions} onClick={() => requireAuth(() => addToCart({ id, title, price, imageUrl }))}>
              <BagIcon />
              <span>{t("product.addToCart")}</span>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <Link href={`/products/${id}`}>
            <h3 className={styles.structuredTitle}>{title}</h3>
          </Link>
          <div className={styles.priceRow}>
            <span className={styles.structuredPrice}>
              {free ? "Gift" : formatUsd(price)}
            </span>
          </div>
        </div>

        <QuickView product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
      </div>
      </>
    );
  }

  // Default Pinterest/Masonry style
  return (
    <div className={`${styles.cardWrapper} masonry-item animate-fade-in`}>
      <Link href={`/products/${id}`} className={`${styles.card} vintage-card pin-shadow`}>
        <article>
          <div className={`${styles.imageContainer} ${pinterestAspectRatio}`}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`${styles.image} film-image`}
              priority={false}
            />
            
            {/* Pinterest Style Overlay */}
            <div className={styles.overlay}>
              <h2 className={styles.title}>{title}</h2>
              <span className={styles.price}>
                {free ? "Gift" : formatUsd(price)}
              </span>
            </div>

            {/* Tags */}
            <div className={styles.tags}>
              {isKnitwear && (
                <span className={`${styles.tag} ${styles.knitTag}`}>🧶 Knit Studio</span>
              )}
              {sold && (
                <div className={styles.statusOverlay}>
                  <span className={styles.soldStamp}>ARCHIVE</span>
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
      
      {/* Floating Wishlist Button */}
      {!sold && (
        <div className={styles.wishlistBtn}>
          <WishlistButton productId={id} />
        </div>
      )}
    </div>
  );
}

// Icon Components
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  );
}

function ZoomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
  );
}
