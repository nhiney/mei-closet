"use client";

import { useState } from "react";
import { useReviews } from "@/context/ReviewContext";
import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./ReviewSection.module.css";

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarDisplay({ rating, max = 5, size = "normal" }: { rating: number; max?: number; size?: "small" | "normal" }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={styles.star}
          style={{ fontSize: size === "small" ? "0.9rem" : "1.1rem" }}
        >
          {i < Math.floor(rating) ? "★" : i < rating ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${styles.starInteractive}`}
          style={{ fontSize: "1.8rem", color: star <= (hovered || value) ? "#F59E0B" : "var(--color-border-strong)" }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          title={`${star} sao`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Review Section ───────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

export function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { getReviewsByProduct, addReview, markHelpful, hasReviewed, getAverageRating } = useReviews();

  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reviews = getReviewsByProduct(productId);
  const avgRating = getAverageRating(productId);
  const alreadyReviewed = user ? hasReviewed(productId, user.userId) : false;

  // Build rating breakdown
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const handleSubmit = async () => {
    if (!user || !newContent.trim() || newRating === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    addReview(productId, user.userId, user.email.split("@")[0], newRating, newContent.trim());
    setNewContent("");
    setNewRating(5);
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <section className={styles.section}>
      {/* Header with Rating Summary */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Đánh giá sản phẩm {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length > 0 && (
          <div className={styles.ratingSummary}>
            <div className={styles.avgRating}>
              <span className={styles.avgNumber}>{avgRating.toFixed(1)}</span>
              <StarDisplay rating={avgRating} size="small" />
              <span className={styles.avgTotal}>{reviews.length} đánh giá</span>
            </div>
            <div className={styles.ratingBars}>
              {breakdown.map(({ star, count, pct }) => (
                <div key={star} className={styles.ratingBar}>
                  <span className={styles.barLabel}>{star}</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.barCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write Review */}
      {submitted ? (
        <div className={styles.alreadyReviewed}>
          ✅ Cảm ơn bạn đã chia sẻ đánh giá! Đánh giá của bạn đã được ghi nhận.
        </div>
      ) : alreadyReviewed ? (
        <div className={styles.alreadyReviewed}>
          Bạn đã đánh giá sản phẩm này rồi. Cảm ơn bạn đã chia sẻ! 💛
        </div>
      ) : user ? (
        <div className={styles.writeReview}>
          <h3 className={styles.writeTitle}>Viết đánh giá của bạn</h3>
          <div className={styles.ratingPrompt}>
            <span className={styles.ratingPromptLabel}>Chất lượng:</span>
            <StarPicker value={newRating} onChange={setNewRating} />
          </div>
          <textarea
            className={styles.reviewTextarea}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm... (chất liệu, màu sắc, kích thước, giao hàng...)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button
            className={styles.submitBtn}
            disabled={submitting || !newContent.trim()}
            onClick={handleSubmit}
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá ✨"}
          </button>
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("mei-open-auth", { detail: { mode: "login" } })); }}>
            Đăng nhập
          </a>{" "}
          để viết đánh giá sản phẩm
        </div>
      )}

      {/* Review List */}
      <div className={styles.reviewList}>
        {reviews.length === 0 ? (
          <div className={styles.noReviews}>
            Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ! 💬
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewerAvatar}>
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.reviewerName}>{review.userName}</div>
                    <div className={styles.reviewDate}>{timeAgo(review.createdAt)}</div>
                  </div>
                </div>
                <div className={styles.reviewMeta}>
                  <StarDisplay rating={review.rating} size="small" />
                </div>
              </div>
              <p className={styles.reviewContent}>{review.content}</p>
              <div className={styles.reviewFooter}>
                <button
                  className={styles.helpfulBtn}
                  onClick={() => markHelpful(review.id)}
                >
                  👍 Hữu ích
                </button>
                {review.helpful > 0 && (
                  <span className={styles.helpfulCount}>{review.helpful} người thấy hữu ích</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
