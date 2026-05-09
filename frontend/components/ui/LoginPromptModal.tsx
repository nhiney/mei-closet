"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./LoginPromptModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  productImage?: string;
  action?: "cart" | "buy";
};

export function LoginPromptModal({ isOpen, onClose, productTitle, productImage, action = "cart" }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actionText = action === "buy" ? "mua hàng" : "thêm vào giỏ";

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.iconWrap}>🛍️</div>

        <h2 className={styles.title}>Đăng nhập để tiếp tục</h2>
        <p className={styles.desc}>
          Bạn cần đăng nhập để {actionText}.<br />
          Tham gia Mei Closet ngay để trải nghiệm mua sắm trọn vẹn!
        </p>

        {productTitle && (
          <div className={styles.productHint}>
            {productImage && (
              <img src={productImage} alt={productTitle} className={styles.productHintImage} />
            )}
            <div className={styles.productHintText}>
              <span className={styles.productHintTitle}>{productTitle}</span>
              Đang chờ bạn trong giỏ hàng
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/login" className={styles.btnLogin} onClick={onClose}>
            Đăng nhập
          </Link>
          <Link href="/login?mode=register" className={styles.btnRegister} onClick={onClose}>
            Tạo tài khoản mới
          </Link>
          <span className={styles.separator}>Miễn phí · Nhanh chóng · An toàn</span>
        </div>
      </div>
    </div>
  );
}
