"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatUsd } from "@/lib/format";
import type { FeedProduct } from "@/features/feed/types";
import styles from "./QuickView.module.css";

type QuickViewProps = {
  product: FeedProduct;
  isOpen: boolean;
  onClose: () => void;
};

const SIZES = ["S", "M", "L", "XL"];

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const sold = product.status === "sold";
  const free = product.price === 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize ?? undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.imageWrap}>
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="400px"
            className={styles.image}
          />
          {sold && <div className={styles.soldOverlay}>{t("product.soldOut")}</div>}
        </div>
        <div className={styles.info}>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.price}>{free ? "Gift" : formatUsd(product.price)}</p>

          {!sold && (
            <>
              <div className={styles.sizes}>
                <span className={styles.label}>{t("filter.size")}</span>
                <div className={styles.sizeChips}>
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      className={`${styles.sizeChip} ${selectedSize === s ? styles.active : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={`${styles.addBtn} ${added ? styles.addedBtn : ""}`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? "✓ " + t("cart.added") : t("product.addToCart")}
              </button>
            </>
          )}

          <Link href={`/products/${product.id}`} className={styles.detailLink} onClick={onClose}>
            {t("product.viewDetail")} →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
