import type { Request, Response } from "express";
import { sendFailure, sendSuccess } from "../lib/response.js";
import {
  getConversationMessagesService,
  getUserConversationsService,
  markAsReadService,
} from "../services/chatService.js";

export async function getConversations(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const conversations = await getUserConversationsService(req.userId);
    sendSuccess(res, conversations);
  } catch (err) {
    console.error(err);
    sendFailure(res, 500, "Could not fetch conversations");
  }
}

export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    const { productId, otherUserId } = req.params;
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    const messages = await getConversationMessagesService(
      productId,
      req.userId,
      otherUserId
    );
    sendSuccess(res, messages);
  } catch (err) {
    console.error(err);
    sendFailure(res, 500, "Could not fetch messages");
  }
}

export async function markRead(req: Request, res: Response): Promise<void> {
  try {
    const { productId, senderId } = req.body;
    if (!req.userId) {
      sendFailure(res, 401, "Unauthorized");
      return;
    }
    await markAsReadService(productId, req.userId, senderId);
    sendSuccess(res, { ok: true });
  } catch (err) {
    console.error(err);
    sendFailure(res, 500, "Could not mark messages as read");
  }
}
