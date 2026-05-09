"use client";

import { useState } from "react";
import styles from "./MixMatchGame.module.css";

const TOPS = [
  { id: 1, name: "Áo len vặn thừng", img: "https://images.unsplash.com/photo-1574167132757-1247a8b9745e?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Sơ mi Vintage", img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Cardigan thêu hoa", img: "https://images.unsplash.com/photo-1624371414361-e6e0ed26296c?auto=format&fit=crop&q=80&w=400" }
];

const BOTTOMS = [
  { id: 1, name: "Chân váy Midi hoa", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Quần Jeans ống loe", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Quần yếm nhung", img: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&q=80&w=400" }
];

const FEEDBACKS = [
  "Trời ơi, nàng phối đồ cực 'gu' luôn! ✨",
  "Một sự kết hợp đầy hơi thở hoài cổ! 🌿",
  "Phong cách này sinh ra là dành cho bạn! 🌸",
  "Cực kỳ ấn tượng và phá cách! 🧶"
];

export function MixMatchGame() {
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleReview = () => {
    setFeedback(FEEDBACKS[Math.floor(Math.random() * FEEDBACKS.length)]);
    setShowResult(true);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.gameLayout}>
          <div className={styles.sidebar}>
            <span className={styles.tag}>VIRTUAL STYLIST</span>
            <h2 className={styles.title}>Thử làm Stylist cùng Mei</h2>
            <p className={styles.desc}>Hãy phối một bộ đồ thật "chất" từ tủ đồ của Mei và xem trợ lý AI chấm điểm cho bạn nhé!</p>
            
            <div className={styles.selectors}>
              <div className={styles.selectorGroup}>
                <label>CHỌN ÁO</label>
                <div className={styles.scrollItems}>
                  {TOPS.map((item, i) => (
                    <div 
                      key={item.id} 
                      className={`${styles.smallItem} ${top === i ? styles.active : ""}`}
                      onClick={() => { setTop(i); setShowResult(false); }}
                    >
                      <img src={item.img} alt={item.name} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.selectorGroup}>
                <label>CHỌN QUẦN/VÁY</label>
                <div className={styles.scrollItems}>
                  {BOTTOMS.map((item, i) => (
                    <div 
                      key={item.id} 
                      className={`${styles.smallItem} ${bottom === i ? styles.active : ""}`}
                      onClick={() => { setBottom(i); setShowResult(false); }}
                    >
                      <img src={item.img} alt={item.name} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className={styles.reviewBtn} onClick={handleReview}>Xem đánh giá</button>
          </div>

          <div className={styles.previewArea}>
            <div className={styles.mannequin}>
              <div className={styles.previewTop}>
                <img src={TOPS[top].img} alt="Selected Top" />
              </div>
              <div className={styles.previewBottom}>
                <img src={BOTTOMS[bottom].img} alt="Selected Bottom" />
              </div>
            </div>
            
            {showResult && (
              <div className={styles.resultOverlay}>
                <div className={styles.resultCard}>
                  <span className={styles.resultIcon}>🌟</span>
                  <p className={styles.feedback}>{feedback}</p>
                  <p className={styles.gift}>Tặng nàng voucher <b>MEISTYLE</b> giảm 15% cho set đồ này!</p>
                  <button className={styles.closeBtn} onClick={() => setShowResult(false)}>Tiếp tục phối đồ</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
