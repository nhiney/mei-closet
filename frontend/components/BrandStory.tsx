"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./BrandStory.module.css";

export function BrandStory() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.editorialGrid}>
          <div className={styles.imageContent}>
            <div className={styles.mainImageWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1200" 
                alt="Vintage Studio" 
                className={styles.mainImage}
              />
              <div className={styles.accentCard}>
                <span className={styles.accentTitle}>Philosophy</span>
                <p className={styles.accentText}>Sustainability through curation.</p>
              </div>
            </div>
          </div>

          <div className={styles.textContent}>
            <span className={styles.eyebrow}>CHUYỆN CỦA MEI</span>
            <h2 className={styles.heading}>
              Triết lý về cái đẹp bền vững
            </h2>
            <p className={styles.paragraph}>
              Tại Mei Closet, chúng tôi tin rằng thời trang không chỉ là vẻ bề ngoài, 
              mà là cách chúng ta trân trọng những giá trị bền vững. Mỗi món đồ vintage được tuyển chọn 
              đều mang trong mình một câu chuyện, một linh hồn riêng biệt.
            </p>
            <p className={styles.paragraph}>
              Chúng tôi cũng dành tình yêu đặc biệt cho đồ len đan tay. Bởi trong từng mũi đan, 
              có hơi ấm của bàn tay con người, có sự kiên nhẫn và cả những niềm hy vọng nhỏ bé. 
              Đó là thứ vẻ đẹp không thể tìm thấy ở bất kỳ dây chuyền sản xuất công nghiệp nào.
            </p>
            <div className={styles.footer}>
              <div className={styles.signature}>
                <span className={styles.sigLabel}>Thân mến,</span>
                <span className={styles.sigName}>Mei</span>
              </div>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <strong>500+</strong>
                  <span>Sản phẩm duy nhất</span>
                </div>
                <div className={styles.statItem}>
                  <strong>100%</strong>
                  <span>Đan tay thủ công</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
