"use client";

import { useState, useEffect } from "react";
import styles from "./MemoryGame.module.css";

const CARDS = [
  { id: 1, img: "🧶" },
  { id: 2, img: "👗" },
  { id: 3, img: "🧵" },
  { id: 4, img: "🧥" },
  { id: 5, img: "👒" },
  { id: 6, img: "🧣" },
];

export function MemoryGame() {
  const [cards, setCards] = useState<{ id: number, img: string, isFlipped: boolean, isMatched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const doubled = [...CARDS, ...CARDS]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, uniqueId: i, isFlipped: false, isMatched: false }));
    setCards(doubled as any);
  }, []);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlipped([]);
        if (newCards.every(c => c.isMatched)) setFinished(true);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.gameBox}>
          <div className={styles.header}>
            <span className={styles.tag}>FUN & GAMES</span>
            <h2 className={styles.title}>Thử thách trí nhớ cùng Mei</h2>
            <p className={styles.desc}>Tìm các cặp biểu tượng thời trang giống nhau để nhận quà tặng!</p>
            <div className={styles.stats}>Lượt đi: <b>{moves}</b></div>
          </div>

          <div className={styles.grid}>
            {cards.map((card, i) => (
              <div 
                key={(card as any).uniqueId} 
                className={`${styles.card} ${card.isFlipped || card.isMatched ? styles.flipped : ""}`}
                onClick={() => handleFlip(i)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>?</div>
                  <div className={styles.cardBack}>{card.img}</div>
                </div>
              </div>
            ))}
          </div>

          {finished && (
            <div className={styles.winCard}>
              <h3>Tuyệt vời! 🎉</h3>
              <p>Bạn đã hoàn thành thử thách sau {moves} lượt.</p>
              <div className={styles.reward}>Mã quà tặng: <b>MEIMEMORY</b></div>
              <button className={styles.restartBtn} onClick={() => window.location.reload()}>Chơi lại</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
