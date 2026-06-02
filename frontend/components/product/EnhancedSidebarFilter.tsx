"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./EnhancedSidebarFilter.module.css";

const SIZES = ["S", "M", "L", "XL", "FREESIZE"];
const CONDITIONS = ["new", "like_new", "good", "fair"];
const COLORS = [
  { id: "black", hex: "#000000" },
  { id: "white", hex: "#FFFFFF" },
  { id: "beige", hex: "#F5F5DC" },
  { id: "brown", hex: "#8B4513" },
  { id: "blue", hex: "#4682B4" },
  { id: "red", hex: "#b22222" },
];

const conditionCopy: Record<string, Record<string, string>> = {
  vi: { new: "Mới", like_new: "Như mới", good: "Tốt", fair: "Trung bình" },
  en: { new: "New", like_new: "Like New", good: "Good", fair: "Fair" },
};

type Props = {
  selectedSize: string | null;
  onSelectSize: (size: string | null) => void;
  selectedCondition: string | null;
  onSelectCondition: (cond: string | null) => void;
  selectedColor: string | null;
  onSelectColor: (color: string | null) => void;
};

export function EnhancedSidebarFilter({
  selectedSize, onSelectSize,
  selectedCondition, onSelectCondition,
  selectedColor, onSelectColor
}: Props) {
  const { t, language } = useLanguage();

  return (
    <aside className={styles.sidebar}>
      {/* SIZE FILTER */}
      <div className={styles.filterGroup}>
        <div className={styles.sidebarTitle}>
          <span>{t("filter.size")}</span>
          <span>-</span>
        </div>
        <div className={styles.sizeGrid}>
          {SIZES.map(size => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ""} ${size === "FREESIZE" ? styles.freesizeBtn : ""}`}
              onClick={() => onSelectSize(selectedSize === size ? null : size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* CONDITION FILTER */}
      <div className={styles.filterGroup}>
        <div className={styles.sidebarTitle}>
          <span>{t("product.condition")}</span>
          <span>-</span>
        </div>
        <div className={styles.conditionList}>
          {CONDITIONS.map(cond => (
            <label key={cond} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={selectedCondition === cond}
                onChange={() => onSelectCondition(selectedCondition === cond ? null : cond)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                {conditionCopy[language]?.[cond] || cond}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* COLOR FILTER */}
      <div className={styles.filterGroup}>
        <div className={styles.sidebarTitle}>
          <span>{language === 'vi' ? 'MÀU SẮC' : 'COLOR'}</span>
          <span>-</span>
        </div>
        <div className={styles.colorGrid}>
          {COLORS.map(color => (
            <button
              key={color.id}
              className={`${styles.colorBtn} ${selectedColor === color.id ? styles.colorBtnActive : ""}`}
              style={{ backgroundColor: color.hex }}
              title={color.id}
              onClick={() => onSelectColor(selectedColor === color.id ? null : color.id)}
            />
          ))}
        </div>
      </div>
      
      {/* PRICE RANGE (Visual mock) */}
      <div className={styles.filterGroup}>
        <div className={styles.sidebarTitle}>
          <span>{language === 'vi' ? 'MỨC GIÁ' : 'PRICE RANGE'}</span>
          <span>-</span>
        </div>
        <div className={styles.priceSlider}>
          <input type="range" min="0" max="100" defaultValue="100" className={styles.rangeInput} />
          <div className={styles.priceLabels}>
            <span>0 ₫</span>
            <span>500.000 ₫+</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
