"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./AboutSection.module.css";

interface AboutSectionProps {
  isOpen: boolean;
}

export function AboutSection({ isOpen }: AboutSectionProps) {
  const { t } = useLanguage();

  return (
    <div 
      className={`${styles.aboutContainer} ${isOpen ? styles.isOpen : ""}`}
      aria-hidden={!isOpen}
    >
      <div className={styles.innerContent}>
        <div className={styles.contentGrid}>
          {/* Brand Story */}
          <article className={styles.brandStory}>
            <h2 className={styles.heading}>{t("about.story")}</h2>
            <p className={styles.description}>
              {t("about.description1")}
            </p>
            <p className={styles.description}>
              {t("about.description2")}
            </p>
            <p className={styles.description}>
              {t("about.description3")}
            </p>
          </article>

          {/* Side Content: Knit Studio & Mission */}
          <aside className={styles.sideContent}>
            <div className={styles.knitHighlight}>
              <span className={styles.knitText}>{t("about.crafted")}</span>
              <p className={styles.description}>
                {t("about.studioDesc")}
              </p>
              <Link href="/knit-studio" className={styles.knitButton}>
                {t("nav.knit")} 🧶
              </Link>
            </div>

            <div className={styles.quoteContainer}>
              <p className={styles.missionQuote}>
                {t("about.quote")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
