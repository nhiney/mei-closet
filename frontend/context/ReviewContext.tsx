"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Review = {
  id: string;
  productId: string;
  userId: string;       // matches Session.userId
  userName: string;
  rating: number;        // 1–5
  content: string;
  createdAt: string;
  helpful: number;       // how many people found it helpful
};

interface ReviewContextType {
  reviews: Review[];
  getReviewsByProduct: (productId: string) => Review[];
  addReview: (productId: string, userId: string, userName: string, rating: number, content: string) => void;
  markHelpful: (reviewId: string) => void;
  hasReviewed: (productId: string, userId: string) => boolean;
  getAverageRating: (productId: string) => number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
const REVIEWS_KEY = "mei-closet-reviews";

// Seed data for demo
const SEED_REVIEWS: Review[] = [
  {
    id: "review-seed-1",
    productId: "local-1",
    userId: "seed-user-1",
    userName: "Thảo Nguyên",
    rating: 5,
    content: "Sản phẩm đẹp lắm, chất len rất mịn và ấm. Màu sắc đúng như ảnh, rất hài lòng 💛",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
  },
  {
    id: "review-seed-2",
    productId: "local-1",
    userId: "seed-user-2",
    userName: "Minh Châu",
    rating: 4,
    content: "Đẹp hơn tưởng tượng, giao hàng nhanh. Chỉ tiếc size hơi rộng một chút so với mình.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 3,
  },
];

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_KEY);
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        // First time: load seed data
        setReviews(SEED_REVIEWS);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    }
  }, [reviews, hydrated]);

  const getReviewsByProduct = useCallback(
    (productId: string) =>
      reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews]
  );

  const addReview = useCallback(
    (productId: string, userId: string, userName: string, rating: number, content: string) => {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        productId,
        userId,
        userName,
        rating,
        content,
        createdAt: new Date().toISOString(),
        helpful: 0,
      };
      setReviews((prev) => [newReview, ...prev]);
    },
    []
  );

  const markHelpful = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
  }, []);

  const hasReviewed = useCallback(
    (productId: string, userId: string) =>
      reviews.some((r) => r.productId === productId && r.userId === userId),
    [reviews]
  );

  const getAverageRating = useCallback(
    (productId: string) => {
      const productReviews = reviews.filter((r) => r.productId === productId);
      if (productReviews.length === 0) return 0;
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / productReviews.length) * 10) / 10;
    },
    [reviews]
  );

  return (
    <ReviewContext.Provider
      value={{ reviews, getReviewsByProduct, addReview, markHelpful, hasReviewed, getAverageRating }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used within a ReviewProvider");
  return ctx;
}
