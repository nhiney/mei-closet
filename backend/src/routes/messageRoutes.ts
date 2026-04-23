import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createMessage,
  getConversationMeta,
  getInbox,
  getMessages,
} from "../controllers/messageController.js";

export const messageRouter = Router();

messageRouter.post("/", authenticate, asyncHandler(createMessage));
messageRouter.get("/inbox", authenticate, asyncHandler(getInbox));
messageRouter.get(
  "/meta/:conversationId",
  authenticate,
  asyncHandler(getConversationMeta),
);
messageRouter.get(
  "/:conversationId",
  authenticate,
  asyncHandler(getMessages),
);
