"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./KnitStudioFeatured.module.css";

export function KnitStudioFeatured() {
  const { t } = useLanguage();

  const values = [
    { icon: "🧶", title: "100% Thủ công", desc: "Mỗi mũi đan đều chứa đựng tâm huyết của nghệ nhân." },
    { icon: "🌿", title: "Sợi tự nhiên", desc: "An toàn cho làn da, bền bỉ và thân thiện môi trường." },
    { icon: "✨", title: "Độc bản", desc: "Bạn sẽ không tìm thấy chiếc thứ hai giống hệt như vậy." },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.textureOverlay} />
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <span className={styles.tag}>ARTISAN COLLECTION</span>
            <h2 className={styles.title}>Tuyển chọn đồ len đan tay thủ công</h2>
            <p className={styles.description}>
              Hơn cả trang phục, đó là những tác phẩm nghệ thuật có thể mặc được. 
              Mỗi sản phẩm tại Mei Closet được tạo ra để đồng hành cùng bạn qua nhiều mùa đông.
            </p>
            
            <div className={styles.valuesGrid}>
              {values.map((v, i) => (
                <div key={i} className={styles.valueItem}>
                  <span className={styles.valueIcon}>{v.icon}</span>
                  <div>
                    <h4 className={styles.valueTitle}>{v.title}</h4>
                    <p className={styles.valueDesc}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/shop-len" className={styles.button}>
              Khám phá Tiệm Đồ Thủ Công
            </Link>
          </div>
          
          <div className={styles.visualSide}>
            <div className={styles.imageGrid}>
              <div className={`${styles.imageWrapper} ${styles.img1}`}>
                <img src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600" alt="Knit Texture" />
              </div>
              <div className={`${styles.imageWrapper} ${styles.img2}`}>
                <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600" alt="Wool Spools" />
              </div>
            </div>
            <div className={styles.floatingBadge}>
              <span className={styles.badgeText}>SINCE 2024</span>
              <span className={styles.badgeSub}>Handmade with Love</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
