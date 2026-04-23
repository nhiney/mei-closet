import type { Server as HttpServer } from "node:http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { userInConversation } from "../lib/conversation.js";

let io: Server | null = null;

function roomName(conversationId: string) {
  return `conv:${conversationId}`;
}

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) {
        next(new Error("Unauthorized"));
        return;
      }
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub?: string };
      if (!payload.sub) {
        next(new Error("Unauthorized"));
        return;
      }
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // Room management
    socket.on(
      "join",
      (
        conversationId: unknown,
        cb?: (r?: { ok: boolean; error?: string }) => void,
      ) => {
        if (typeof conversationId !== "string") {
          cb?.({ ok: false, error: "Invalid conversation" });
          return;
        }
        const uid = socket.data.userId as string;
        if (!userInConversation(conversationId, uid)) {
          cb?.({ ok: false, error: "Forbidden" });
          return;
        }
        void socket.join(roomName(conversationId));
        cb?.({ ok: true });
      },
    );

    // Private Messaging
    socket.on(
      "message:send",
      async (
        payload: { productId: string; receiverId: string; content: string },
        cb?: (r: { ok: boolean; data?: any; error?: string }) => void
      ) => {
        try {
          const senderId = socket.data.userId;
          if (!senderId) throw new Error("Unauthorized");

          const { saveMessageService } = await import("../services/chatService.js");
          const { buildConversationId } = await import("../lib/conversation.js");

          const message = await saveMessageService({
            senderId,
            receiverId: payload.receiverId,
            productId: payload.productId,
            content: payload.content,
          });

          const convId = buildConversationId(senderId, payload.receiverId, payload.productId);
          
          // Emit to all users in the specific conversation room
          io?.to(roomName(convId)).emit("message:new", message);
          
          cb?.({ ok: true, data: message });
        } catch (err) {
          console.error("Socket message:send error:", err);
          cb?.({ ok: false, error: "Failed to send message" });
        }
      }
    );
  });

  return io;
}

export function emitNewMessage(conversationId: string, payload: unknown) {
  io?.to(roomName(conversationId)).emit("message:new", payload);
}

export function getIo(): Server | null {
  return io;
}
