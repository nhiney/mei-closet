import { getPublicApiBaseUrl } from "@/lib/env";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  } as const;
}

export type InboxRow = {
  conversationId: string;
  peerId: string;
  peerEmail: string | null;
  productId: string;
  productTitle: string;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
};

export async function fetchInbox(token: string): Promise<InboxRow[]> {
  const res = await fetch(`${getPublicApiBaseUrl()}/messages/inbox`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load inbox");
  const data = (await res.json()) as { data: InboxRow[] };
  return data.data ?? [];
}

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  productId: string;
  content: string;
  timestamp: string;
};

export async function fetchMessages(
  token: string,
  conversationId: string,
): Promise<ChatMessage[]> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/messages/${encodeURIComponent(conversationId)}`,
    { headers: authHeaders(token), cache: "no-store" },
  );
  if (!res.ok) throw new Error("Could not load messages");
  const data = (await res.json()) as { data: ChatMessage[] };
  return data.data ?? [];
}

export type ConversationMeta = {
  conversationId: string;
  peerId: string;
  peerEmail: string | null;
  productId: string;
  productTitle: string;
  productImage: string | null;
};

export async function fetchConversationMeta(
  token: string,
  conversationId: string,
): Promise<ConversationMeta> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/messages/meta/${encodeURIComponent(conversationId)}`,
    { headers: authHeaders(token), cache: "no-store" },
  );
  if (!res.ok) throw new Error("Could not load conversation");
  return (await res.json()) as ConversationMeta;
}

export async function postMessage(
  token: string,
  body: { productId: string; content: string; receiverId: string },
): Promise<ChatMessage> {
  const res = await fetch(`${getPublicApiBaseUrl()}/messages`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = "Send failed";
    try {
      const err = (await res.json()) as { error?: { message?: string } };
      if (err.error?.message) msg = err.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const data = (await res.json()) as { message: ChatMessage };
  return data.message;
}
