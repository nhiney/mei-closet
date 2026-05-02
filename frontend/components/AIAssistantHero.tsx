"use client";

import styles from "./AIAssistantHero.module.css";

export function AIAssistantHero() {
  return (
    <section className={styles.section} id="ai-assistant">
      <div className={styles.container}>
        <div className={styles.heroLayout}>
          <div className={styles.textContent}>
            <span className={styles.eyebrow}>AI FASHION ASSISTANT</span>
            <h1 className={styles.mainTitle}>
              Tư vấn phong cách <br />
              Chuẩn gu riêng nàng
            </h1>
            <p className={styles.subDesc}>
              Khám phá thế giới thời trang cùng Mei Assistant. Một trợ lý ảo thông minh 
              hiểu rõ sở thích của nàng và luôn sẵn sàng đưa ra những gợi ý phối đồ hoàn mỹ nhất.
            </p>

            <div className={styles.gridFeatures}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>✨</div>
                <div className={styles.featureText}>
                  <h4>Phối đồ thông minh</h4>
                  <p>Gợi ý trang phục dựa trên vóc dáng và sở thích cá nhân.</p>
                </div>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🧶</div>
                <div className={styles.featureText}>
                  <h4>Chuyên gia len sợi</h4>
                  <p>Tư vấn chi tiết về chất liệu và cách bảo quản đồ đan tay.</p>
                </div>
              </div>
            </div>

            <button className={styles.primaryCta}>Bắt đầu trò chuyện</button>
          </div>

          <div className={styles.visualContent}>
            <div className={styles.aiCircle}></div>
            <div className={styles.chatPreview}>
              <div className={styles.previewHeader}>
                <div className={styles.aiIdentity}>
                  <div className={styles.aiAvatar}>👩‍🎨</div>
                  <div className={styles.aiInfo}>
                    <h5>Mei Assistant</h5>
                    <div className={styles.status}>
                      <span className={styles.statusDot}></span>
                      <span>Đang sẵn sàng</span>
                    </div>
                  </div>
                </div>
                <div className={styles.headerAction}>•••</div>
              </div>

              <div className={styles.chatMessages}>
                <div className={styles.msgUser}>
                  Nàng ơi, mình nên mặc gì cho buổi hẹn hò tối nay?
                </div>
                <div className={styles.msgAi}>
                  Chào nàng! Với tiết trời se lạnh tối nay, mình gợi ý nàng diện chiếc <b>Váy Midi Len</b> phối cùng <b>Cardigan mỏng</b>. Đừng quên một chút phụ kiện ánh kim để thêm phần lung linh nhé! ✨
                </div>
                <div className={styles.typingIndicator}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
