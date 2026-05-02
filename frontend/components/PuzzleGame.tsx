"use client";

import { useState } from "react";
import styles from "./PuzzleGame.module.css";

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export function PuzzleGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  const initGame = () => {
    const newTiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    setTiles(newTiles);
    setIsSolved(false);
    setIsPlaying(true);
  };

  const moveTile = (index: number) => {
    if (isSolved) return;
    const emptyIndex = tiles.indexOf(TILE_COUNT - 1);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      if (newTiles.every((tile, i) => tile === i)) setIsSolved(true);
    }
  };

  if (!isPlaying) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.introCard}>
            <span className={styles.tag}>INTERACTIVE EXPERIENCE</span>
            <h2 className={styles.title}>Mảnh ghép Mei</h2>
            <p className={styles.desc}>
              Mỗi món đồ len đều mang trong mình một câu chuyện. 
              Hãy cùng Mei sắp xếp lại những mảnh ghép để nhận ngay mã giảm giá bí mật cho đơn hàng tiếp theo.
            </p>
            <button className={styles.playBtn} onClick={initGame}>Bắt đầu thử thách</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.gameBox}>
          <div className={styles.gameInfo}>
            <span className={styles.tag}>PUZZLE CHALLENGE</span>
            <h3 className={styles.gameTitle}>
              {isSolved ? "Nàng đã hoàn thành! ✨" : "Sắp xếp lại các mảnh ghép"}
            </h3>
            <p className={styles.desc}>
              Click vào mảnh ghép bên cạnh ô trống để di chuyển. Hoàn thiện bức hình để nhận quà.
            </p>
            
            {isSolved ? (
              <div className={styles.reward}>
                <p>Mã quà tặng của nàng là:</p>
                <b>MEIPUZZLE15</b>
              </div>
            ) : (
              <button className={styles.playBtn} onClick={initGame} style={{marginTop: '2rem'}}>Xáo trộn lại</button>
            )}
          </div>
          
          <div className={styles.puzzleGrid}>
            {tiles.map((tile, i) => (
              <div 
                key={i}
                className={`${styles.tile} ${tile === TILE_COUNT - 1 ? styles.empty : ""}`}
                onClick={() => moveTile(i)}
              >
                {tile !== TILE_COUNT - 1 && (
                  <div className={styles.tileContent}>
                    <span>{tile + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
