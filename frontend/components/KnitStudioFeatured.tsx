"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./KnitStudioFeatured.module.css";

export function KnitStudioFeatured() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className={styles.textureOverlay} />
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.tag}>{t("artisan.tag")}</span>
          <h2 className={styles.title}>
            {t("artisan.title")}
          </h2>
          <p className={styles.description}>
            {t("artisan.desc")}
          </p>
          <Link href="/knit-studio" className={styles.button}>
            {t("artisan.explore")}
          </Link>
        </div>
        
        <div className={styles.imageGrid}>
          {/* Aesthetic grid of small knit detail images */}
          <div className={`${styles.imageWrapper} ${styles.img1}`}>
            <img src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600" alt="Knit Texture" />
          </div>
          <div className={`${styles.imageWrapper} ${styles.img2}`}>
            <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600" alt="Wool Spools" />
          </div>
          <div className={`${styles.imageWrapper} ${styles.img3}`}>
            <img src="https://images.unsplash.com/photo-1618354721010-2c3bf505553e?auto=format&fit=crop&q=80&w=600" alt="Handmade Sweater" />
          </div>
        </div>
      </div>
    </section>
  );
}
