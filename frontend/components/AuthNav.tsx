"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/auth/session";
import { AuthModal } from "./AuthModal";
import styles from "./Navbar.module.css";

export function AuthNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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

  function openAuth(mode: "login" | "register") {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
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
      <button 
        onClick={() => openAuth("login")} 
        className={styles.dropdownItem}
        style={{ width: "100%", textAlign: "left", cursor: "pointer", border: "none", background: "none", fontFamily: "inherit" }}
      >
        Đăng nhập
      </button>
      <button 
        onClick={() => openAuth("register")} 
        className={styles.dropdownItem}
        style={{ width: "100%", textAlign: "left", cursor: "pointer", border: "none", background: "none", fontFamily: "inherit" }}
      >
        Đăng ký thành viên
      </button>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}
