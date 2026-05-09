"use client";

import styles from "./StyleInspiration.module.css";

const LOOKS = [
  { id: 1, title: "Vintage Romantic", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "Modern Knitwear", img: "https://images.unsplash.com/photo-1574167132757-1247a8b9745e?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Classic Minimalist", img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600" },
  { id: 4, title: "Autumn Vibes", img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600" }
];

export function StyleInspiration() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>LOOKBOOK</span>
          <h2 className={styles.title}>Cảm hứng phối đồ</h2>
          <p className={styles.desc}>Khám phá cách chúng mình thổi hồn vào những món đồ cũ.</p>
        </div>
        
        <div className={styles.grid}>
          {LOOKS.map(look => (
            <div key={look.id} className={styles.card}>
              <div className={styles.imgWrapper}>
                <img src={look.img} alt={look.title} />
                <div className={styles.overlay}>
                  <span className={styles.lookTitle}>{look.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
