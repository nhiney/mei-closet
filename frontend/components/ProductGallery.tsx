"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : ["https://picsum.photos/seed/mei-placeholder/800/800"];

  return (
    <div className={styles.gallery}>
      {/* Main Image */}
      <div
        className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ""}`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={displayImages[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={styles.image}
          priority
        />
        <div className={styles.zoomHint}>
          {isZoomed ? "−" : "🔍"}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className={styles.thumbnails}>
          {displayImages.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
