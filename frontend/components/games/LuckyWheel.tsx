"use client";

import { useState, useRef } from "react";
import styles from "./LuckyWheel.module.css";

const PRIZES = [
  { label: "Voucher 10%", code: "MEI10" },
  { label: "Free Ship", code: "FREESHIP" },
  { label: "Voucher 50k", code: "MEI50K" },
  { label: "Chúc bạn may mắn", code: null },
  { label: "Voucher 20%", code: "SPECIAL20" },
  { label: "Quà tặng len", code: "KNITGIFT" }
];

export function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualRotation = newRotation % 360;
      const prizeIndex = Math.floor((360 - actualRotation) / (360 / PRIZES.length)) % PRIZES.length;
      setResult(PRIZES[prizeIndex]);
    }, 4000);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.tag}>INTERACTIVE GAME</span>
          <h2 className={styles.title}>Vòng quay "Sợi chỉ may mắn"</h2>
          <p className={styles.desc}>Thử vận may của bạn để nhận những ưu đãi đặc biệt từ Mei Closet. Mỗi ngày một lượt quay miễn phí!</p>
          
          <div className={styles.wheelContainer}>
            <div className={styles.pointer}>▼</div>
            <div 
              ref={wheelRef}
              className={styles.wheel}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {PRIZES.map((prize, i) => (
                <div 
                  key={i} 
                  className={styles.segment}
                  style={{ transform: `rotate(${i * (360 / PRIZES.length)}deg)` }}
                >
                  <span className={styles.prizeLabel}>{prize.label}</span>
                </div>
              ))}
            </div>
            <button 
              className={`${styles.spinBtn} ${isSpinning ? styles.spinning : ""}`}
              onClick={spin}
              disabled={isSpinning}
            >
              {isSpinning ? "Đang quay..." : "QUAY"}
            </button>
          </div>

          {result && (
            <div className={styles.result}>
              {result.code ? (
                <>
                  <h3 className={styles.resultTitle}>Chúc mừng! Bạn trúng {result.label}</h3>
                  <div className={styles.codeBox}>
                    <code>{result.code}</code>
                    <button onClick={() => navigator.clipboard.writeText(result.code!)}>Copy</button>
                  </div>
                </>
              ) : (
                <h3 className={styles.resultTitle}>Tiếc quá, chúc bạn may mắn lần sau nhé! ✨</h3>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
