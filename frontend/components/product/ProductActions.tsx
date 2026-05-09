"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ProductActions.module.css";

type SizeSelectorProps = {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.sizeSection}>
      <label className={styles.label}>{t("filter.size")}</label>
      <div className={styles.sizeChips}>
        {sizes.map((s) => (
          <button
            key={s}
            className={`${styles.sizeChip} ${selected === s ? styles.sizeActive : ""}`}
            onClick={() => onSelect(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

type QuantitySelectorProps = {
  value: number;
  onChange: (qty: number) => void;
  max?: number;
};

export function QuantitySelector({ value, onChange, max = 10 }: QuantitySelectorProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.qtySection}>
      <label className={styles.label}>{t("product.quantity")}</label>
      <div className={styles.qtyControls}>
        <button
          className={styles.qtyBtn}
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
        >
          −
        </button>
        <span className={styles.qtyValue}>{value}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

type AddToCartButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function AddToCartButton({ onClick, disabled }: AddToCartButtonProps) {
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    onClick();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      className={`${styles.addToCartBtn} ${added ? styles.added : ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {added ? "✓ " + t("cart.added") : t("product.addToCart")}
    </button>
  );
}

type BuyNowButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function BuyNowButton({ onClick, disabled }: BuyNowButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      className={styles.buyNowBtn}
      onClick={onClick}
      disabled={disabled}
    >
      {t("product.buyNow")}
    </button>
  );
}
