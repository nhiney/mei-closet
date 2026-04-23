"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loadSession } from "@/lib/auth/session";
import { getPublicApiBaseUrl } from "@/lib/env";
import { buildConversationId } from "@/lib/conversation";

type Conversation = {
  id: string;
  productId: string;
  product: { title: string; images: string[] };
  otherUser: { name?: string; email: string };
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
};

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      setLoading(false);
      return;
    }

    fetch(`${getPublicApiBaseUrl()}/chat/conversations`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setConversations(json.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-zinc-500">Retrieving your chats...</div>;
  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <span className="mb-4 text-4xl">📭</span>
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p className="text-sm text-zinc-500">When you message a seller or receive an inquiry, it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
      {conversations.map((conv) => {
        const session = loadSession();
        const convId = session ? buildConversationId(session.userId, (conv as any).otherUser._id || (conv as any).otherUser.id, conv.productId) : conv.id;
        
        return (
          <Link
            key={conv.id}
            href={`/messages/${encodeURIComponent(convId)}`}
            className="group flex items-center gap-4 p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-zinc-100">
              {conv.product.images?.[0] && (
                <Image
                  src={conv.product.images[0]}
                  alt={conv.product.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {conv.product.title}
                </h4>
                <span className="text-[10px] text-zinc-400">
                  {new Date(conv.lastTimestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {conv.otherUser.name || conv.otherUser.email.split("@")[0]}: {conv.lastMessage}
              </p>
            </div>

            {conv.unreadCount > 0 && (
              <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white ring-4 ring-white dark:ring-zinc-950">
                {conv.unreadCount}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
