"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const BANNER_IMAGES = [
  "/banner/img1.jpg", "/banner/img2.jpg", "/banner/img3.jpg",
  "/banner/img4.jpg", "/banner/img5.jpg", "/banner/img6.jpg",
  "/banner/img7.jpg", "/banner/img8.jpg", "/banner/img9.png",
  "/banner/img10.jpg", "/banner/img11.jpg", "/banner/img12.jpg",
  "/banner/img13.jpg", "/banner/img14.jpg", "/banner/img15.jpg",
  "/banner/img16.jpg", "/banner/img17.jpg", "/banner/img18.jpg",
  "/banner/img19.jpg", "/banner/img20.jpg"
];

export function Hero() {
  const { t } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Cinematic Background Slider */}
      <div className={styles.backgroundContainer}>
        {BANNER_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${t("hero.alt") || "Vintage Fashion Editorial"} ${index + 1}`}
            fill
            priority={index === 0}
            className={`${styles.backgroundImage} ${index === currentIndex ? styles.active : ""}`}
          />
        ))}
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        <span className={styles.subtitle}>{t("hero.subtitle")}</span>
        <h1 className={styles.title}>
          Mei Closet
        </h1>
        <p className={`${styles.description} handwritten`} style={{ color: 'white', fontSize: '1.5rem', opacity: 0.9 }}>
          {t("hero.description")}
        </p>
        
        <div className={styles.actions}>
          <Link href="/#feed" className={styles.btnPrimary}>
            {t("hero.explore")}
          </Link>
          <Link href="/knit-studio" className={styles.btnSecondary}>
            {t("hero.knitStudio")} 🧶
          </Link>
        </div>
      </div>
    </section>
  );
}
