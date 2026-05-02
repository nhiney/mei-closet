"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiLogin, apiRegister } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";
import { getPublicApiBaseUrl } from "@/lib/env";
import styles from "./AuthModal.module.css";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
};

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with initialMode when opened
  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = mode === "login" 
        ? await apiLogin(email, password)
        : await apiRegister(email, password);
      
      saveSession({
        accessToken: res.tokens.accessToken,
        email: res.user.email,
        userId: res.user.id,
        role: res.user.role,
      });
      
      onClose();
      router.refresh();
      window.dispatchEvent(new Event("mei-auth-change"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left Side: Artistic Panel */}
        <div className={styles.imageSide}>
          <img 
            src={mode === "login" ? "/products/knitwear/tiencavotri.jpg" : "/products/knitwear/xuong-ca.jpg"} 
            alt="Mei Closet" 
          />
          <div className={styles.imageOverlay}>
            <h3>{mode === "login" ? "Chào mừng nàng trở lại" : "Tham gia cùng Mei Closet"}</h3>
            <p>
              {mode === "login" 
                ? "Khám phá tủ đồ secondhand tuyển chọn và những món đồ đan tay đầy tâm huyết."
                : "Bắt đầu hành trình thời trang bền vững và sở hữu những thiết kế độc bản."}
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className={styles.formSide}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabBtn} ${mode === "login" ? styles.tabBtnActive : ""}`}
              onClick={() => setMode("login")}
            >
              Đăng nhập
            </button>
            <button 
              className={`${styles.tabBtn} ${mode === "register" ? styles.tabBtnActive : ""}`}
              onClick={() => setMode("register")}
            >
              Đăng ký
            </button>
          </div>

          <div className={styles.header}>
            <h2>{mode === "login" ? "Hân hạnh được đón tiếp" : "Tạo tài khoản mới"}</h2>
            <p>{mode === "login" ? "Tiếp tục hành trình phong cách của nàng" : "Bắt đầu câu chuyện thời trang của nàng hôm nay"}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nang@example.com"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={styles.input}
              />
              {mode === "register" && (
                <p style={{fontSize: '0.7rem', color: '#999', marginTop: '8px'}}>
                  Tối thiểu 8 ký tự nàng nhé.
                </p>
              )}
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Đang xử lý..." : (mode === "login" ? "Đăng nhập ngay" : "Tạo tài khoản")}
            </button>
          </form>

          <div className={styles.socialAuth}>
            <div className={styles.divider}>Hoặc tiếp tục với</div>
            <div className={styles.socialBtns}>
              <a href={`${getPublicApiBaseUrl()}/auth/google`} className={styles.socialBtn}>
                <GoogleIcon /> Google
              </a>
              <a href={`${getPublicApiBaseUrl()}/auth/facebook`} className={styles.socialBtn}>
                <FacebookIcon /> Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
}

function FacebookIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
