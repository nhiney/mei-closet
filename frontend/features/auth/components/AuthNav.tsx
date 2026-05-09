"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/auth/session";
import styles from "@/components/layout/Navbar.module.css";

export function AuthNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      setEmail(s?.email ?? null);
      setRole(s?.role ?? null);
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("mei-auth-change", sync);
    
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("mei-auth-change", sync);
    };
  }, []);

  function logout() {
    clearSession();
    setEmail(null);
    setRole(null);
    router.refresh();
  }

  if (email) {
    return (
      <div className={styles.authDropdownContent}>
        <div className={styles.userBrief}>
          <div className={styles.avatarMiniSquare}>{email[0].toUpperCase()}</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{email.split('@')[0]}</span>
            <span className={styles.userEmail}>{email}</span>
          </div>
        </div>
        <div className={styles.divider} />
        <Link href="/profile" className={styles.dropdownItem}>
          <UserIconMini /> Hồ sơ của tôi
        </Link>
        {role === "admin" && (
          <Link href="/dashboard" className={styles.dropdownItem}>
            <AdminIconMini /> Quản trị viên
          </Link>
        )}
        <button type="button" onClick={logout} className={styles.dropdownItem}>
          <LogoutIconMini /> Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authActionStackSquare}>
      <Link href="/login" className={styles.authSquareBtnPrimary}>
        Đăng nhập
      </Link>
      <Link href="/login?mode=register" className={styles.authSquareBtnSecondary}>
        Đăng ký thành viên
      </Link>
      <div className={styles.divider} />
      <div className={styles.authQuickLinksSquare}>
        <Link href="/track-order">Theo dõi đơn hàng</Link>
        <Link href="/help">Trợ giúp</Link>
      </div>
    </div>
  );
}

function UserIconMini() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function AdminIconMini() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
}
function LogoutIconMini() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
