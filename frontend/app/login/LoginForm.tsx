"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiLogin } from "@/lib/api/auth";
import { getPublicApiBaseUrl } from "@/lib/env";
import { saveSession } from "@/lib/auth/session";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/sell";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "OAuthNotConfigured") {
      setError("Tính năng đăng nhập qua mạng xã hội đang được bảo trì (thiếu API keys). Vui lòng đăng nhập bằng Email.");
    } else if (urlError === "OAuthFailed") {
      setError("Đăng nhập qua mạng xã hội thất bại. Vui lòng thử lại hoặc dùng Email.");
    } else if (urlError) {
      setError("Lỗi xác thực. Vui lòng thử lại.");
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      saveSession({
        accessToken: res.tokens.accessToken,
        email: res.user.email,
        userId: res.user.id,
        role: res.user.role,
      });
      router.push(next.startsWith("/") ? next : "/sell");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-6 text-left bg-white p-8 sm:p-12 border border-border"
    >
      <div className="flex flex-col gap-3">
        <label
          htmlFor="login-email"
          className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-b border-zinc-200 bg-transparent py-2 text-sm text-zinc-900 outline-none transition-all focus:border-black"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label
          htmlFor="login-password"
          className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border-b border-zinc-200 bg-transparent py-2 text-sm text-zinc-900 outline-none transition-all focus:border-black"
        />
      </div>
      {error ? (
        <p
          className="border border-red-100 bg-red-50/50 px-4 py-3 text-xs text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-primary px-4 py-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Sign In"}
      </button>

      <div className="relative my-4 flex items-center text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400">
        <div className="flex-grow border-t border-zinc-100" />
        <span className="px-4">Or</span>
        <div className="flex-grow border-t border-zinc-100" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a
          href={`${getPublicApiBaseUrl()}/auth/google`}
          className="flex justify-center border border-zinc-200 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-50"
        >
          Google
        </a>
        <a
          href={`${getPublicApiBaseUrl()}/auth/facebook`}
          className="flex justify-center border border-zinc-200 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-50"
        >
          Facebook
        </a>
      </div>

      <p className="mt-4 text-center text-[0.7rem] text-zinc-500">
        New to Mei Closet?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(next)}`}
          className="font-bold text-black underline underline-offset-4"
        >
          Join Now
        </Link>
      </p>
    </form>
  );
}
