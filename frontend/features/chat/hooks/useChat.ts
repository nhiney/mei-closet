"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getPublicApiBaseUrl } from "@/lib/env";

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export function useChat(accessToken: string, productId?: string, otherUserId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket
  useEffect(() => {
    if (!accessToken) return;

    const socketUrl = getPublicApiBaseUrl().replace("/api", "");
    const newSocket = io(socketUrl, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => setConnected(true));
    newSocket.on("connect_error", (err) => setError(err.message));
    newSocket.on("disconnect", () => setConnected(false));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  // Fetch history and join room
  useEffect(() => {
    if (!socket || !productId || !otherUserId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${getPublicApiBaseUrl()}/chat/messages/${productId}/${otherUserId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const json = await res.json();
        if (json.success) {
          setMessages(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    fetchHistory();

    // In a real app, we'd calculate the conversationId properly
    // For now, let's assume the backend 'join' handler works with logic
    // But since buildConversationId is private to backend, the backend should handle joining
    // Actually, let's just use the room pattern: conv:productId:buyerId
    // We need to know who is the buyer. 
    // Simplified: our backend socket handler 'message:send' handles delivery.
    // For joining, we need a common conversationId.
  }, [socket, productId, otherUserId, accessToken]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !productId || !otherUserId || !content.trim()) return;

      socket.emit(
        "message:send",
        { productId, receiverId: otherUserId, content },
        (response: any) => {
          if (!response.ok) {
            console.error("Failed to send message", response.error);
          }
        }
      );
    },
    [socket, productId, otherUserId]
  );

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: Message) => {
      // Only add if it belongs to the current conversation
      if (msg.productId === productId && (msg.senderId === otherUserId || msg.receiverId === otherUserId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, productId, otherUserId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    sendMessage,
    connected,
    error,
    messagesEndRef,
  };
}
