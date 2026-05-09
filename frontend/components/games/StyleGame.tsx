"use client";

import { useState } from "react";
import styles from "./StyleGame.module.css";

const ROUNDS = [
  {
    question: "Tâm trạng hôm nay của bạn là?",
    options: [
      { id: "a", label: "Dịu dàng & Hoài niệm", img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=600" },
      { id: "b", label: "Cá tính & Tự do", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    question: "Bạn thích buổi chiều nào hơn?",
    options: [
      { id: "a", label: "Đọc sách bên cửa sổ", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600" },
      { id: "b", label: "Dạo bước dưới nắng thu", img: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    question: "Chất liệu yêu thích của bạn?",
    options: [
      { id: "a", label: "Len đan tay ấm áp", img: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600" },
      { id: "b", label: "Vải lanh mộc mạc", img: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600" }
    ]
  }
];

const RESULTS = {
  a: { title: "The Romantic Dreamer", desc: "Bạn là người yêu vẻ đẹp tinh tế, nhẹ nhàng. Những món đồ len thủ công của Mei sẽ là người bạn đồng hành hoàn hảo cho tâm hồn lãng mạn của bạn.", code: "ROMANCE10" },
  b: { title: "The Bold Minimalist", desc: "Bạn yêu sự đơn giản nhưng phải có gu riêng. Những thiết kế vintage độc bản tại Mei sẽ giúp bạn khẳng định phong cách không lẫn vào đâu được.", code: "BOLDMEI" }
};

export function StyleGame() {
  const [step, setStep] = useState(-1); // -1: Intro, 0-2: Rounds, 3: Result
  const [score, setScore] = useState({ a: 0, b: 0 });

  const handleChoice = (id: string) => {
    setScore(prev => ({ ...prev, [id]: prev[id as keyof typeof prev] + 1 }));
    setStep(prev => prev + 1);
  };

  const result = score.a >= score.b ? RESULTS.a : RESULTS.b;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.gameCard}>
          {step === -1 && (
            <div className={styles.intro}>
              <span className={styles.tag}>PLAY & DISCOVER</span>
              <h2 className={styles.title}>Tìm kiếm "DNA" thời trang của bạn</h2>
              <p className={styles.desc}>Trả lời nhanh 3 câu hỏi để khám phá phong cách vintage phù hợp nhất với bạn và nhận quà tặng bí mật.</p>
              <button className={styles.startBtn} onClick={() => setStep(0)}>Bắt đầu ngay</button>
            </div>
          )}

          {step >= 0 && step < ROUNDS.length && (
            <div className={styles.round}>
              <div className={styles.progress}>Câu hỏi {step + 1} / {ROUNDS.length}</div>
              <h3 className={styles.question}>{ROUNDS[step].question}</h3>
              <div className={styles.options}>
                {ROUNDS[step].options.map(opt => (
                  <div key={opt.id} className={styles.option} onClick={() => handleChoice(opt.id)}>
                    <div className={styles.imgWrapper}>
                      <img src={opt.img} alt={opt.label} />
                    </div>
                    <span className={styles.label}>{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === ROUNDS.length && (
            <div className={styles.result}>
              <div className={styles.resultHeader}>
                <span className={styles.resultTag}>STYLE PERSONA</span>
                <h2 className={styles.resultTitle}>{result.title}</h2>
              </div>
              <p className={styles.resultDesc}>{result.desc}</p>
              <div className={styles.reward}>
                <span className={styles.rewardLabel}>Quà tặng cho bạn: Giảm 10% đơn đầu tiên</span>
                <div className={styles.codeBox}>
                  <code>{result.code}</code>
                  <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(result.code)}>Copy</button>
                </div>
              </div>
              <button className={styles.restartBtn} onClick={() => { setStep(-1); setScore({ a: 0, b: 0 }); }}>Chơi lại</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
