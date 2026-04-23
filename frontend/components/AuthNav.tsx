"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/auth/session";

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
      <div className="flex items-center gap-6">
        {role === "admin" && (
          <Link
            href="/dashboard"
            className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#8B6F5C] hover:text-[#2B2B2B] transition-colors"
          >
            Atelier
          </Link>
        )}
        <span
          className="hidden max-w-[8rem] truncate text-[0.6rem] uppercase tracking-widest text-[#D1C4B0] sm:inline"
          title={email}
        >
          {email}
        </span>
        <button
          type="button"
          onClick={logout}
          className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#8B6F5C] hover:text-[#D8A7A7] transition-colors"
        >
          Depart
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8">
      <Link
        href="/login"
        className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#8B6F5C] hover:text-[#2B2B2B] transition-colors"
      >
        Enter
      </Link>
      <Link
        href="/register"
        className="bg-[#8B6F5C] px-6 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#705544] shadow-[4px_4px_0_#E8DCCB]"
      >
        Join Archive
      </Link>
    </div>
  );
}
