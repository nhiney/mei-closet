"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./AiAdvisor.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

const QUICK_REPLIES = [
  "Tư vấn chọn size",
  "Cách phối đồ len",
  "Bảo quản đồ len",
  "Chính sách giao hàng",
  "Sản phẩm mới nhất",
];

const GREETING: Message = {
  role: "assistant",
  content: "Xin chào! Mình là trợ lý tư vấn của Mei Closet 🌸\n\nMình có thể giúp bạn tìm sản phẩm phù hợp, tư vấn phối đồ, chọn size hoặc giải đáp mọi thắc mắc nhé!",
  time: now(),
};

function now() {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function AiAdvisor() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Show bubble hint after 8s if user hasn't opened
  useEffect(() => {
    const t = setTimeout(() => { if (!open) setShowBubble(true); }, 8000);
    const t2 = setTimeout(() => setShowBubble(false), 16000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (open) setShowBubble(false);
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 80) + "px";
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply, time: now() },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, mình đang gặp sự cố. Bạn thử lại sau nhé! 🙏", time: now() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className={styles.fab}>
      {/* Chat Drawer */}
      {open && (
        <div className={styles.drawer}>
          {/* Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerHeaderLeft}>
              <div className={styles.drawerAvatar}>🧶</div>
              <div>
                <div className={styles.drawerTitle}>Mei AI Advisor</div>
                <div className={styles.drawerSubtitle}>
                  <span className={styles.onlineDot} />
                  Đang hoạt động
                </div>
              </div>
            </div>
            <button className={styles.drawerCloseBtn} onClick={() => setOpen(false)} aria-label="Đóng">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.messageBubble} ${msg.role === "user" ? styles.messageUser : styles.messageAi}`}
              >
                {msg.content.split("\n").map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>
                ))}
                <span className={styles.messageTime}>{msg.time}</span>
              </div>
            ))}
            {loading && (
              <div className={styles.typing}>
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className={styles.quickReplies}>
              {QUICK_REPLIES.map(q => (
                <button key={q} className={styles.quickReply} onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className={styles.inputArea}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Hỏi mình điều gì đó..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Gửi"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bubble hint */}
      {showBubble && !open && (
        <div className={styles.fabBubble} onClick={() => setOpen(true)}>
          Mình có thể giúp gì cho bạn? 💬
        </div>
      )}

      {/* FAB button */}
      <button
        className={`${styles.fabBtn} ${open ? styles.fabBtnOpen : ""}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? "Đóng tư vấn AI" : "Mở tư vấn AI"}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <span>🧶</span>
        )}
      </button>
    </div>
  );
}
