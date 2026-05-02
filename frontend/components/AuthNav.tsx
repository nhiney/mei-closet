"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/auth/session";
import styles from "./Navbar.module.css";

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
      <>
        <Link href="/profile" className={styles.dropdownItem}>
          Hồ sơ của tôi
        </Link>
        {role === "admin" && (
          <Link href="/dashboard" className={styles.dropdownItem}>
            Quản trị viên
          </Link>
        )}
        <button
          type="button"
          onClick={logout}
          className={styles.dropdownItem}
          style={{ width: "100%", textAlign: "left", cursor: "pointer", border: "none", background: "none", fontFamily: "inherit" }}
        >
          Đăng xuất
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={styles.dropdownItem}>
        Đăng nhập
      </Link>
      <Link href="/register" className={styles.dropdownItem}>
        Đăng ký thành viên
      </Link>
    </>
  );
}
