"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./ReviewSection.module.css";

export type Review = {
  id: string;
  productId: string;
  author: string;
  userId: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
};

const STORAGE_KEY = "mei-closet-reviews";
const STAR_LABELS = ["", "Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời!"];

function loadReviews(productId: string): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Review[] = raw ? JSON.parse(raw) : [];
    return all.filter(r => r.productId === productId);
  } catch { return []; }
}

function saveReview(review: Review) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Review[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, review]));
  } catch { /* ignore */ }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className={styles.ratingBarRow}>
      <span className={styles.ratingBarLabel}>{stars}★</span>
      <div className={styles.ratingBarTrack}>
        <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.ratingBarCount}>{count}</span>
    </div>
  );
}

type Props = { productId: string; productTitle: string };

export function ReviewSection({ productId, productTitle }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    const loaded = loadReviews(productId);
    setReviews(loaded);
    if (user && loaded.some(r => r.userId === user.userId)) {
      setAlreadyReviewed(true);
    }
  }, [productId, user]);

  const avg = reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const countPerStar = [5, 4, 3, 2, 1].map(s => reviews.filter(r => r.rating === s).length);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || !text.trim()) return;

    const newReview: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      productId,
      author: user.email.split("@")[0],
      userId: user.userId,
      rating,
      text: text.trim(),
      date: new Date().toISOString(),
      verified: true,
    };

    saveReview(newReview);
    setReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    setAlreadyReviewed(true);
    setText("");
    setRating(0);
  }, [user, rating, text, productId]);

  const starDisplay = hoverRating || rating;

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        Đánh giá sản phẩm ({reviews.length})
      </h3>

      {/* ── Summary ── */}
      {reviews.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.ratingBig}>
            <div className={styles.ratingNumber}>{avg.toFixed(1)}</div>
            <span className={styles.ratingStars}>
              {"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}
            </span>
            <span className={styles.ratingCount}>{reviews.length} đánh giá</span>
          </div>
          <div className={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((s, i) => (
              <RatingBar key={s} stars={s} count={countPerStar[i]} total={reviews.length} />
            ))}
          </div>
        </div>
      )}

      {/* ── Review list ── */}
      {reviews.length === 0 ? (
        <p className={styles.empty}>Chưa có đánh giá nào. Hãy là người đầu tiên! ✨</p>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map(r => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewLeft}>
                  <div className={styles.reviewAvatar}>{getInitials(r.author)}</div>
                  <div>
                    <span className={styles.reviewAuthor}>{r.author}</span>
                    {r.verified && (
                      <span className={styles.reviewVerified}>
                        ✓ Đã mua hàng
                      </span>
                    )}
                  </div>
                </div>
                <span className={styles.reviewStars}>
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p className={styles.reviewText}>{r.text}</p>
              <span className={styles.reviewDate}>{formatDate(r.date)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Write review ── */}
      {!isAuthenticated ? (
        <div className={styles.loginNudge}>
          <p className={styles.loginNudgeText}>
            Đăng nhập để viết đánh giá và chia sẻ trải nghiệm của bạn
          </p>
          <Link href="/login" className={styles.loginNudgeLink}>
            Đăng nhập
          </Link>
        </div>
      ) : alreadyReviewed ? (
        <div className={styles.successMsg}>
          ✓ Bạn đã đánh giá sản phẩm này. Cảm ơn bạn! 💝
        </div>
      ) : submitted ? (
        <div className={styles.successMsg}>
          ✓ Đánh giá của bạn đã được gửi thành công! Cảm ơn bạn 💝
        </div>
      ) : (
        <div>
          <h4 className={styles.formTitle}>Viết đánh giá của bạn</h4>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Star Picker */}
            <div>
              <div className={styles.starPicker}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.starBtn} ${s <= starDisplay ? styles.starBtnFilled : ""}`}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    aria-label={`${s} sao`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {starDisplay > 0 && (
                <span className={styles.starLabel}>{STAR_LABELS[starDisplay]}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Nhận xét của bạn *</label>
              <textarea
                className={styles.textarea}
                placeholder={`Hãy chia sẻ cảm nhận của bạn về ${productTitle}...`}
                value={text}
                onChange={e => setText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={rating === 0 || !text.trim()}
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
