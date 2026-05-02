"use client";

import styles from "./AIAssistantBanner.module.css";

export function AIAssistantBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.content}>
            <span className={styles.badge}>NEW FEATURE</span>
            <h2 className={styles.title}>Gặp gỡ Mei Assistant</h2>
            <p className={styles.desc}>
              Trợ lý ảo thông minh giúp bạn tìm size chuẩn, phối đồ "gu" 
              và giải đáp mọi thắc mắc về đồ len handmade.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.icon}>📏</span>
                <span>Tư vấn size chính xác</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.icon}>🧶</span>
                <span>Mẹo bảo quản đồ len</span>
              </div>
            </div>
          </div>
          
          <div className={styles.visual}>
            <div className={styles.phoneMockup}>
              <div className={styles.chatHeader}>Mei Assistant</div>
              <div className={styles.chatBody}>
                <div className={styles.chatMsg}>Chào bạn! Mình có thể giúp gì cho nàng hôm nay? ✨</div>
                <div className={`${styles.chatMsg} ${styles.user}`}>Mình muốn tìm áo len phối với chân váy vintage ạ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
