"use client";

import { useState } from "react";
import styles from "./StyleForecast.module.css";

const MOODS = [
  { id: "romantic", emoji: "🌸", label: "Lãng mạn" },
  { id: "chill", emoji: "🌿", label: "Bình yên" },
  { id: "bold", emoji: "⚡", label: "Cá tính" },
  { id: "dreamy", emoji: "☁️", label: "Mộng mơ" }
];

const FORECASTS: Record<string, { vibe: string, item: string, tip: string }> = {
  romantic: {
    vibe: "Nàng thơ ngọt ngào",
    item: "Cardigan thêu hoa",
    tip: "Hôm nay là ngày tuyệt vời để diện một chiếc váy hoa nhí cùng áo len mỏng xuống phố."
  },
  chill: {
    vibe: "Tự do & Phóng khoáng",
    item: "Quần Jeans ống rộng",
    tip: "Một chút thoải mái với chất liệu denim và áo len oversized sẽ giúp nàng tràn đầy năng lượng."
  },
  bold: {
    vibe: "Năng động & Phá cách",
    item: "Áo gile len họa tiết",
    tip: "Đừng ngại thử những gam màu tương phản. Sự phá cách chính là điểm nhấn của nàng hôm nay."
  },
  dreamy: {
    vibe: "Dịu dàng & Hoài niệm",
    item: "Váy Midi Vintage",
    tip: "Một bộ đồ mang hơi thở cổ điển sẽ giúp nàng kết nối với những kỷ niệm đẹp đẽ."
  }
};

export function StyleForecast() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.forecastLayout}>
          <div className={styles.intro}>
            <span className={styles.tag}>DAILY STYLE FORECAST</span>
            <h2 className={styles.title}>Hôm nay nàng là ai?</h2>
            <p className={styles.desc}>
              Phong cách không chỉ là quần áo, mà là cách nàng kể câu chuyện về chính mình. 
              Hãy chọn một cảm xúc, Mei sẽ giúp nàng tìm thấy bộ trang phục hoàn hảo nhất cho hôm nay.
            </p>
          </div>

          <div className={styles.content}>
            {!selected ? (
              <div className={styles.moodGrid}>
                {MOODS.map(mood => (
                  <button 
                    key={mood.id} 
                    className={styles.moodBtn}
                    onClick={() => setSelected(mood.id)}
                  >
                    <span className={styles.emoji}>{mood.emoji}</span>
                    <span className={styles.label}>{mood.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.result}>
                <div className={styles.resultCard}>
                  <h3>{FORECASTS[selected].vibe}</h3>
                  <p className={styles.tip}>{FORECASTS[selected].tip}</p>
                  <div className={styles.lucky}>
                    <span>Lucky Item:</span>
                    <strong>{FORECASTS[selected].item}</strong>
                  </div>
                  <button className={styles.resetBtn} onClick={() => setSelected(null)} style={{marginTop: '2rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline'}}>Chọn lại tâm trạng</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
