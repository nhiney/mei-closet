"use client";

import { useEffect, useState } from "react";
import { checkIsFavorited, toggleWishlist } from "@/lib/api/products";
import styles from "./WishlistButton.module.css";

export function WishlistButton({ productId }: { productId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    checkIsFavorited(productId).then(setIsFavorited);
  }, [productId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    const success = await toggleWishlist(productId, isFavorited);
    if (success) {
      setIsFavorited(!isFavorited);
    }
    setIsToggling(false);
  };

  return (
    <button
      className={`${styles.button} ${isFavorited ? styles.active : ""}`}
      onClick={handleToggle}
      disabled={isToggling}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={styles.icon}>{isFavorited ? "❤️" : "🤍"}</span>
    </button>
  );
}
