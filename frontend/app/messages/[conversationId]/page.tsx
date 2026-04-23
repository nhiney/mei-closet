"use client";

import { useParams } from "next/navigation";
import { ChatPageClient } from "./ChatPageClient";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = decodeURIComponent(
    String(params.conversationId ?? ""),
  );

  if (!conversationId) {
    return (
      <p className="px-4 py-10 text-center text-sm text-zinc-600">
        Invalid conversation.
      </p>
    );
  }

  return <ChatPageClient conversationId={conversationId} />;
}
