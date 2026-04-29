"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { SizeSelector, QuantitySelector, AddToCartButton, BuyNowButton } from "@/components/ProductActions";
import { WishlistButton } from "@/components/WishlistButton";
import { ReviewSection } from "@/components/ReviewSection";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { formatUsd } from "@/lib/format";
import type { ApiProduct } from "@/lib/api/types";
import type { FeedProduct } from "@/features/feed/types";
import styles from "./ProductDetailClient.module.css";

type ProductDetailClientProps = {
  apiProduct: ApiProduct;
  product: FeedProduct;
  relatedProducts: FeedProduct[];
};

const conditionCopy: Record<string, Record<string, string>> = {
  vi: { new: "Mới", like_new: "Như mới", good: "Tốt", fair: "Trung bình" },
  en: { new: "New", like_new: "Like new", good: "Good", fair: "Fair" },
};

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL"];


export function ProductDetailClient({ apiProduct, product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const router = useRouter();
  const { requireAuth, showLoginPrompt, closeLoginPrompt } = useRequireAuth();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pendingAction, setPendingAction] = useState<"cart" | "buy">("cart");

  const sold = product.status === "sold";
  const free = product.price === 0;
  const conditionLabel = conditionCopy[language]?.[product.condition] ?? product.condition;

  const doAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize ?? undefined,
    }, quantity);
  };

  const handleAddToCart = () => {
    setPendingAction("cart");
    requireAuth(doAddToCart);
  };

  const handleBuyNow = () => {
    setPendingAction("buy");
    requireAuth(() => {
      doAddToCart();
      router.push("/cart");
    });
  };

  return (
    <>
    <LoginPromptModal
      isOpen={showLoginPrompt}
      onClose={closeLoginPrompt}
      productTitle={product.title}
      productImage={product.imageUrl}
      action={pendingAction}
    />
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← {t("product.backToShop")}
        </Link>

        <div className={styles.grid}>
          {/* Left: Gallery */}
          <ProductGallery images={apiProduct.images} title={product.title} />

          {/* Right: Product Info */}
          <div className={styles.info}>
            <div className={styles.badges}>
              <span className={styles.inventoryBadge}>
                No. {product.id.slice(-6).toUpperCase()}
              </span>
              <span className={styles.conditionBadge}>• {conditionLabel} •</span>
              {sold && (
                <span className={styles.soldLabel}>{t("product.soldOut")}</span>
              )}
            </div>

            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{free ? "Gift" : formatUsd(product.price)}</span>
              <WishlistButton productId={product.id} />
            </div>

            <div className={styles.divider} />

            {/* Description */}
            {apiProduct.description ? (
              <p className={styles.description}>"{apiProduct.description}"</p>
            ) : (
              <p className={styles.noDesc}>{t("product.noDesc")}</p>
            )}

            <div className={styles.divider} />

            {/* Product Details Table */}
            <div className={styles.detailsTable}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t("product.condition")}</span>
                <span>{conditionLabel}</span>
              </div>
              {apiProduct.category && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>{t("product.category")}</span>
                  <span style={{ textTransform: "capitalize" }}>{apiProduct.category}</span>
                </div>
              )}
              {apiProduct.size && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>{t("filter.size")}</span>
                  <span>{apiProduct.size}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t("product.care")}</span>
                <span>{t("product.careInstructions")}</span>
              </div>
            </div>

            {/* Actions (only if available) */}
            {!sold && (
              <div className={styles.actions}>
                <SizeSelector
                  sizes={AVAILABLE_SIZES}
                  selected={selectedSize}
                  onSelect={setSelectedSize}
                />
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <div className={styles.buttonGroup}>
                  <AddToCartButton onClick={handleAddToCart} />
                  <BuyNowButton onClick={handleBuyNow} />
                </div>
              </div>
            )}

            <p className={styles.guarantee}>
              {t("product.guarantee")}
            </p>
          </div>
        </div>

        {/* Size Guide */}
        <section className={styles.sizeGuide}>
          <h3 className={styles.sectionTitle}>{t("product.sizeGuide")}</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("filter.size")}</th>
                  <th>{t("product.chest")}</th>
                  <th>{t("product.waist")}</th>
                  <th>{t("product.length")}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>86-90 cm</td><td>66-70 cm</td><td>62 cm</td></tr>
                <tr><td>M</td><td>90-94 cm</td><td>70-74 cm</td><td>64 cm</td></tr>
                <tr><td>L</td><td>94-98 cm</td><td>74-78 cm</td><td>66 cm</td></tr>
                <tr><td>XL</td><td>98-102 cm</td><td>78-82 cm</td><td>68 cm</td></tr>
                <tr><td>2XL</td><td>102-106 cm</td><td>82-86 cm</td><td>70 cm</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <ReviewSection productId={product.id} productTitle={product.title} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className={styles.related}>
            <h3 className={styles.sectionTitle}>{t("product.related")}</h3>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/products/${rp.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedImage}>
                    <img src={rp.imageUrl} alt={rp.title} />
                  </div>
                  <h4 className={styles.relatedTitle}>{rp.title}</h4>
                  <span className={styles.relatedPrice}>{formatUsd(rp.price)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
    </>
  );
}
