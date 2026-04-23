"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession } from "@/lib/auth/session";

function SuccessAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (token && userId && email) {
      saveSession({
        accessToken: token,
        userId,
        email,
      });
      // Redirect to home/feed or /sell after successful auth
      router.replace("/");
      router.refresh();
    } else {
      router.replace("/login?error=InvalidAuth");
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Signing you in...
      </p>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessAuthHandler />
    </Suspense>
  );
}
