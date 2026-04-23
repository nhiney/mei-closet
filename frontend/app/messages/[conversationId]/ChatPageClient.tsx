"use client";

import { useEffect, useState } from "react";
import { loadSession, Session } from "@/lib/auth/session";
import { parseConversationId } from "@/lib/conversation";
import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { getPublicApiBaseUrl } from "@/lib/env";

export function ChatPageClient({ conversationId }: { conversationId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [meta, setMeta] = useState<{ title: string; image?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = loadSession();
    setSession(s);

    if (s && conversationId) {
      const parsed = parseConversationId(conversationId);
      if (parsed) {
        // Fetch product info
        fetch(`${getPublicApiBaseUrl()}/products/${parsed.productId}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success) {
              setMeta({
                title: json.data.title,
                image: json.data.images?.[0],
              });
            }
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [conversationId]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Setting up the secure line...</div>;
  }

  if (!session || !conversationId) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Authentication required for private line.</div>;
  }

  const parsed = parseConversationId(conversationId);
  if (!parsed) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Static on the line... (Invalid ID)</div>;
  }

  const otherUserId = session.userId === parsed.userA ? parsed.userB : parsed.userA;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <ChatWindow
        accessToken={session.accessToken}
        currentUserId={session.userId}
        productId={parsed.productId}
        otherUserId={otherUserId}
        productTitle={meta?.title || "Listing"}
        productImage={meta?.image}
      />
    </div>
  );
}
