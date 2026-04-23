"use client";

import Image from "next/image";
import Link from "next/link";
import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchConversationMeta,
  fetchMessages,
  postMessage,
  type ChatMessage,
  type ConversationMeta,
} from "@/lib/api/messages";
import { getSocketOrigin } from "@/lib/env";
import { loadSession } from "@/lib/auth/session";

export function ThreadView({ conversationId }: { conversationId: string }) {
  const [mounted, setMounted] = useState(false);
  const [meta, setMeta] = useState<ConversationMeta | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const load = useCallback(async () => {
    const s = loadSession();
    if (!s?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const [m, list] = await Promise.all([
        fetchConversationMeta(s.accessToken, conversationId),
        fetchMessages(s.accessToken, conversationId),
      ]);
      setMeta(m);
      setMessages(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load chat");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!mounted) return;
    void load();
  }, [load, mounted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!mounted) return;
    const s = loadSession();
    if (!s?.accessToken) return;

    const socket = io(getSocketOrigin(), {
      transports: ["websocket", "polling"],
      auth: { token: s.accessToken },
    });

    socket.on("connect", () => {
      socket.emit("join", conversationId, (r?: { ok?: boolean }) => {
        if (r && !r.ok) {
          setError("Could not join realtime channel");
        }
      });
    });

    socket.on("message:new", (msg: ChatMessage) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, mounted]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const s = loadSession();
    const trimmed = text.trim();
    if (!s?.accessToken || !trimmed || !meta) return;
    setSending(true);
    setError(null);
    try {
      const msg = await postMessage(s.accessToken, {
        productId: meta.productId,
        receiverId: meta.peerId,
        content: trimmed,
      });
      setText("");
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  const session = loadSession();
  if (!session?.accessToken) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-zinc-600">
        <Link href="/login" className="font-semibold text-violet-600">
          Log in
        </Link>{" "}
        to view this conversation.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (error && !meta) {
    return (
      <p className="mx-auto max-w-lg px-4 py-10 text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] max-w-lg flex-col px-4 py-4">
      <div className="mb-3 flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Link
          href="/messages"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
        >
          ← Inbox
        </Link>
      </div>

      {meta ? (
        <div className="mb-4 flex gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
          {meta.productImage ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={meta.productImage}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {meta.peerEmail ?? meta.peerId}
            </p>
            <p className="truncate text-xs text-zinc-500">{meta.productTitle}</p>
          </div>
        </div>
      ) : null}

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {messages.map((m) => {
          const mine = m.senderId === session.userId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <form onSubmit={(e) => void send(e)} className="mt-3 flex gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          maxLength={2000}
          className="min-w-0 flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Send
        </button>
      </form>
    </div>
  );
}
