"use client";

import { useState } from "react";
import styles from "./FashionQuiz.module.css";

const QUESTIONS = [
  {
    q: "Đồ len handmade nên được bảo quản như thế nào?",
    a: [
      { text: "Giặt máy thoải mái", correct: false },
      { text: "Giặt tay nước lạnh, phơi nằm ngang", correct: true },
      { text: "Treo móc đứng khi phơi", correct: false }
    ]
  },
  {
    q: "Thuật ngữ 'Vintage' thường dùng để chỉ món đồ có tuổi đời từ bao nhiêu năm?",
    a: [
      { text: "Trên 5 năm", correct: false },
      { text: "Trên 20 năm", correct: true },
      { text: "Chỉ cần là đồ cũ", correct: false }
    ]
  },
  {
    q: "Tại sao nên chọn thời trang bền vững (Sustainable Fashion)?",
    a: [
      { text: "Bảo vệ môi trường & Giảm lãng phí", correct: true },
      { text: "Vì nó rẻ hơn đồ mới", correct: false },
      { text: "Vì nó đang là xu hướng", correct: false }
    ]
  }
];

export function FashionQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.quizBox}>
          {!finished ? (
            <>
              <div className={styles.header}>
                <span className={styles.tag}>FASHION QUIZ</span>
                <h2 className={styles.title}>Bạn am hiểu đồ Vintage & Len đến mức nào?</h2>
                <div className={styles.progress}>Câu hỏi {current + 1} / {QUESTIONS.length}</div>
              </div>
              <div className={styles.questionCard}>
                <p className={styles.questionText}>{QUESTIONS[current].q}</p>
                <div className={styles.options}>
                  {QUESTIONS[current].a.map((opt, i) => (
                    <button key={i} className={styles.optionBtn} onClick={() => handleAnswer(opt.correct)}>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.result}>
              <h2 className={styles.resultTitle}>
                {score === QUESTIONS.length ? "Tuyệt vời! Bạn là một tín đồ thời trang thực thụ 🌟" : "Cảm ơn bạn đã tham gia! 😊"}
              </h2>
              <p className={styles.scoreText}>Điểm của bạn: {score}/{QUESTIONS.length}</p>
              <p className={styles.desc}>Dù điểm số ra sao, Mei vẫn luôn ở đây để cùng bạn khám phá những giá trị bền vững.</p>
              <button className={styles.resetBtn} onClick={() => { setCurrent(0); setScore(0); setFinished(false); }}>Thử lại</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
