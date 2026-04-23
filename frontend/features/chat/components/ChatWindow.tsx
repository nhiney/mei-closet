"use client";

import { useState } from "react";
import Image from "next/image";
import { Message, useChat } from "../hooks/useChat";
import styles from "./ChatWindow.module.css";

type ChatWindowProps = {
  accessToken: string;
  currentUserId: string;
  productId: string;
  otherUserId: string;
  productTitle: string;
  productImage?: string;
};

export function ChatWindow({
  accessToken,
  currentUserId,
  productId,
  otherUserId,
  productTitle,
  productImage,
}: ChatWindowProps) {
  const [content, setContent] = useState("");
  const { messages, sendMessage, connected, messagesEndRef } = useChat(
    accessToken,
    productId,
    otherUserId
  );

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;
    sendMessage(content);
    setContent("");
  };

  return (
    <div className={`${styles.chatWindow} paper-texture`}>
      <header className={styles.header}>
        {productImage && (
          <Image
            src={productImage}
            alt={productTitle}
            width={50}
            height={50}
            className={`${styles.productThumb} film-image`}
          />
        )}
        <div className="flex flex-col gap-1">
          <h3 className="handwritten text-xl text-[#2B2B2B]">{productTitle}</h3>
          <p className="text-[0.6rem] uppercase tracking-widest text-[#8B6F5C]">
            {connected ? "Connection Secure — Stamped" : "Dispatching Letters..."}
          </p>
        </div>
      </header>

      <div className={styles.messages}>
        {messages.map((msg) => {
          const isSent = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                isSent ? styles.messageSent : styles.messageReceived
              }`}
            >
              <div
                className={`${styles.bubble} ${
                  isSent ? styles.bubbleSent : styles.bubbleReceived
                }`}
              >
                <div className={styles.messageContent}>{msg.content}</div>
                <div className={`${styles.timestamp} handwritten`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.footer} onSubmit={handleSend}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            placeholder="Write a letter to the owner..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.sendButton} disabled={!content.trim()}>
          Stamp & Send
        </button>
      </form>
    </div>
  );
}
