"use client";

import { useRouter } from "next/navigation";

export function FeedError({ message }: { message: string }) {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-left dark:border-red-900/60 dark:bg-red-950/40"
      role="alert"
    >
      <p className="text-sm font-semibold text-red-900 dark:text-red-100">
        We couldn&apos;t load the feed
      </p>
      <p className="mt-1 text-sm text-red-800/90 dark:text-red-200/90">
        {message}
      </p>
      <p className="mt-2 text-xs text-red-800/80 dark:text-red-200/80">
        Make sure the API is running and{" "}
        <code className="rounded bg-red-100 px-1 py-0.5 text-[11px] dark:bg-red-900/60">
          NEXT_PUBLIC_API_URL
        </code>{" "}
        points at{" "}
        <code className="rounded bg-red-100 px-1 py-0.5 text-[11px] dark:bg-red-900/60">
          /api
        </code>
        .
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-4 inline-flex rounded-full bg-red-900 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 dark:bg-red-200 dark:text-red-950 dark:hover:bg-red-100"
      >
        Retry
      </button>
    </div>
  );
}
