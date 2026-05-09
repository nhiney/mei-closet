"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UploadForm } from "@/features/listings/UploadForm";
import { clearSession, loadSession, type Session } from "@/lib/auth/session";

export function SellPageClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Log in to sell
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You need an account to upload photos and publish a listing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/login?next=/sell"
            className="inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Log in
          </Link>
          <Link
            href="/login?mode=register&next=/sell"
            className="inline-flex rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-12">
      <UploadForm
        accessToken={session.accessToken}
        email={session.email}
        role={session.role}
        onAuthLost={() => {
          clearSession();
          setSession(null);
        }}
      />
    </div>
  );
}
