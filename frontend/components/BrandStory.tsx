"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./BrandStory.module.css";

export function BrandStory() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.editorialGrid}>
          <div className={styles.textContent}>
            <span className={styles.eyebrow}>{t("philosophy.eyebrow")}</span>
            <h2 className={styles.heading}>
              {t("philosophy.heading")}
            </h2>
            <p className={styles.paragraph}>
              {t("philosophy.p1")}
            </p>
            <p className={styles.paragraph}>
              {t("philosophy.p2")}
            </p>
            <div className={styles.signature}>
              <span className="handwritten">— Mei</span>
            </div>
          </div>
          
          <div className={styles.imageContent}>
            <div className={styles.imageOverlay} />
            <img 
              src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1200" 
              alt="Vintage Studio" 
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
