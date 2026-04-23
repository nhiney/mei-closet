import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getConversations,
  getMessages,
  markRead,
} from "../controllers/chatController.js";
// No-op

const router = Router();

router.use(authenticate);

router.get("/conversations", getConversations);
router.get("/messages/:productId/:otherUserId", getMessages);
router.post("/read", markRead);

export const chatRouter = router;
