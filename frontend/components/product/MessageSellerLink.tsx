"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadSession } from "@/lib/auth/session";
import { buildConversationId } from "@/lib/conversation";

type Mode = "loading" | "sold" | "own" | "guest" | "chat";

export function MessageSellerLink({
  productId,
  ownerId,
  status,
}: {
  productId: string;
  ownerId: string;
  status: string;
}) {
  const [mode, setMode] = useState<Mode>("loading");
  const [href, setHref] = useState("");

  useEffect(() => {
    if (status === "sold") {
      setMode("sold");
      return;
    }
    const s = loadSession();
    if (!s?.userId) {
      setMode("guest");
      setHref(`/login?next=${encodeURIComponent(`/products/${productId}`)}`);
      return;
    }
    if (s.userId === ownerId) {
      setMode("own");
      return;
    }
    setMode("chat");
    setHref(
      `/messages/${encodeURIComponent(buildConversationId(s.userId, ownerId, productId))}`,
    );
  }, [productId, ownerId, status]);

  if (mode === "loading") {
    return (
      <span className="text-sm text-zinc-500" aria-busy="true">
        Loading…
      </span>
    );
  }
  if (mode === "sold") return null;
  if (mode === "own") {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This is your listing.
      </p>
    );
  }

  const pill =
    "inline-flex justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition";

  if (mode === "guest") {
    return (
      <Link
        href={href}
        className={`${pill} border border-zinc-300 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-900`}
      >
        Log in to message seller
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${pill} bg-violet-600 text-white hover:bg-violet-500`}
    >
      Message seller
    </Link>
  );
}
