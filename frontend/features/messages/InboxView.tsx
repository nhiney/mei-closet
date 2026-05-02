"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchInbox, type InboxRow } from "@/lib/api/messages";
import { loadSession } from "@/lib/auth/session";

export function InboxView() {
  const [mounted, setMounted] = useState(false);
  const [rows, setRows] = useState<InboxRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    void (async () => {
      const session = loadSession();
      if (!session?.accessToken) {
        if (!cancelled) setRows([]);
        return;
      }
      try {
        const data = await fetchInbox(session.accessToken);
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load inbox");
          setRows([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-lg space-y-3 px-4 py-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  const session = loadSession();
  if (!session?.accessToken) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Log in to see your conversations.
        </p>
        <Link
          href="/login?next=/messages"
          className="mx-auto inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (rows === null) {
    return (
      <div className="mx-auto max-w-lg space-y-3 px-4 py-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="mx-auto max-w-lg px-4 py-10 text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          No messages yet
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Open a listing and tap <span className="font-semibold">Message seller</span>{" "}
          to start a chat.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Browse feed
        </Link>
      </div>
    );
  }

  return (
    <ul className="mx-auto max-w-lg divide-y divide-zinc-200 px-4 dark:divide-zinc-800">
      {rows.map((row) => (
        <li key={row.conversationId}>
          <Link
            href={`/messages/${encodeURIComponent(row.conversationId)}`}
            className="flex flex-col gap-1 py-4 transition hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {row.peerEmail ?? row.peerId}
                </span>
                {row.unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {row.unreadCount > 99 ? "99+" : row.unreadCount}
                  </span>
                )}
              </div>
              <span className="shrink-0 text-xs text-zinc-500">
                {new Date(row.lastAt).toLocaleDateString()}
              </span>
            </div>
            <span className="truncate text-xs text-zinc-500">
              {row.productTitle}
            </span>
            <span className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {row.lastMessage}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
