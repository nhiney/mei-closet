"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiLogin, apiRegister } from "@/lib/api/auth";
import { saveSession, loadSession } from "@/lib/auth/session";
import { getPublicApiBaseUrl } from "@/lib/env";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  
  const [formMode, setFormMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    const session = loadSession();
    if (session) {
      router.push("/");
    }
  }, [router]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = formMode === "login" 
        ? await apiLogin(email, password)
        : await apiRegister(email, password);
      
      saveSession({
        accessToken: res.tokens.accessToken,
        email: res.user.email,
        userId: res.user.id,
        role: res.user.role,
      });
      
      window.dispatchEvent(new Event("mei-auth-change"));
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      {/* Left: Cinematic Image Panel */}
      <div className={styles.imagePanel}>
        <img 
          src="https://images.unsplash.com/photo-1539109132314-d4d859a19395?q=80&w=1974&auto=format&fit=crop" 
          alt="Mei Closet Fashion" 
          className={styles.bgImage}
        />
        <div className={styles.imageOverlay}>
          <div className={styles.brandInfo}>
            <Link href="/" className={styles.backHome}>
              <ArrowLeftIcon /> Quay về trang chủ
            </Link>
            <div className={styles.brandLogo}>MEI</div>
            <h1 className={styles.heroText}>Dịu dàng <br /> & Tinh tế</h1>
            <p className={styles.heroSub}>Nơi vẻ đẹp của nàng được trân trọng qua từng sợi vải.</p>
            <div className={styles.signature}>Designed for her</div>
          </div>
          <div className={styles.imageFooter}>
            <p>© 2024 Mei Closet. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.authHeader}>
            <h2>{formMode === "login" ? "Chào nàng trở lại" : "Tạo tài khoản mới"}</h2>
            <p>{formMode === "login" ? "Vui lòng nhập thông tin để tiếp tục hành trình cùng Mei" : "Trở thành hội viên để nhận những đặc quyền sớm nhất"}</p>
          </div>

          <div className={styles.tabsContainer}>
            <div className={`${styles.tabSlider} ${formMode === "register" ? styles.tabSliderRight : ""}`} />
            <button 
              className={`${styles.tabBtn} ${formMode === "login" ? styles.tabBtnActive : ""}`}
              onClick={() => setFormMode("login")}
            >
              Đăng nhập
            </button>
            <button 
              className={`${styles.tabBtn} ${formMode === "register" ? styles.tabBtnActive : ""}`}
              onClick={() => setFormMode("register")}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleAuth} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Địa chỉ Email</label>
              <div className={styles.inputWrapper}>
                <EmailIcon />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Mật khẩu</label>
                {formMode === "login" && <Link href="/forgot-password" className={styles.forgotPass}>Quên mật khẩu?</Link>}
              </div>
              <div className={styles.inputWrapper}>
                <LockIcon />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Đang xử lý..." : (formMode === "login" ? "Đăng nhập ngay" : "Tạo tài khoản ngay")}
            </button>
          </form>

          <div className={styles.socialAuth}>
            <div className={styles.divider}><span>Hoặc tiếp tục với</span></div>
            <div className={styles.socialGrid}>
              <a href={`${getPublicApiBaseUrl()}/auth/google`} className={styles.socialBtn}>
                <img src="/icons/google.svg" alt="" width="20" height="20" /> Google
              </a>
              <a href={`${getPublicApiBaseUrl()}/auth/facebook`} className={styles.socialBtn}>
                <img src="/icons/facebook.svg" alt="" width="20" height="20" /> Facebook
              </a>
            </div>
          </div>

          <div className={styles.footerNote}>
            {formMode === "login" ? (
              <p>Chưa có tài khoản? <button onClick={() => setFormMode("register")}>Đăng ký ngay</button></p>
            ) : (
              <p>Đã có tài khoản? <button onClick={() => setFormMode("login")}>Đăng nhập ngay</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
function EmailIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function LockIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function EyeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
