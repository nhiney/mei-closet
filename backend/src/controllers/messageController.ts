import type { Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { HttpError } from "../lib/httpError.js";
import {
  buildConversationId,
  parseConversationId,
  userInConversation,
} from "../lib/conversation.js";
import { emitNewMessage } from "../socket/index.js";
import { Message } from "../models/Message.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const createBody = z.object({
  productId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  content: z.string().trim().min(1).max(2000),
  receiverId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id))
    .optional(),
});

function serializeMessage(doc: {
  _id: mongoose.Types.ObjectId;
  conversationId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
}) {
  return {
    id: doc._id.toString(),
    conversationId: doc.conversationId,
    senderId: String(doc.senderId),
    receiverId: String(doc.receiverId),
    productId: String(doc.productId),
    content: doc.content,
    timestamp: (doc.createdAt ?? new Date()).toISOString(),
  };
}

export async function createMessage(
  req: import("express").Request,
  res: Response,
) {
  if (!req.userId) throw new HttpError(401, "Unauthorized", "UNAUTHORIZED");
  const body = createBody.parse(req.body);
  const senderId = req.userId;

  const product = (await Product.findById(body.productId).lean()) as {
    ownerId: mongoose.Types.ObjectId;
  } | null;
  if (!product) throw new HttpError(404, "Product not found", "NOT_FOUND");

  const sellerStr = String(product.ownerId);
  let receiverStr: string;
  if (senderId === sellerStr) {
    if (!body.receiverId) {
      throw new HttpError(
        400,
        "receiverId is required when replying as the seller",
        "BAD_REQUEST",
      );
    }
    receiverStr = body.receiverId;
    if (receiverStr === senderId) {
      throw new HttpError(400, "You cannot message yourself", "BAD_REQUEST");
    }
  } else {
    receiverStr = sellerStr;
    if (body.receiverId && body.receiverId !== receiverStr) {
      throw new HttpError(400, "Invalid receiver for this product", "BAD_REQUEST");
    }
  }

  const conversationId = buildConversationId(
    senderId,
    receiverStr,
    body.productId,
  );

  const msg = await Message.create({
    conversationId,
    senderId,
    receiverId: receiverStr,
    productId: body.productId,
    content: body.content,
  });

  const payload = serializeMessage(msg);
  emitNewMessage(conversationId, payload);
  res.status(201).json({ message: payload });
}

export async function getMessages(
  req: import("express").Request,
  res: Response,
) {
  if (!req.userId) throw new HttpError(401, "Unauthorized", "UNAUTHORIZED");
  const { conversationId } = req.params;
  if (!userInConversation(conversationId, req.userId)) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }

  const docs = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(200)
    .lean();

  // Mark all unread messages received by the user in this conversation to read
  await Message.updateMany(
    { conversationId, receiverId: req.userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({
    data: docs.map((d) =>
      serializeMessage(
        d as unknown as Parameters<typeof serializeMessage>[0],
      ),
    ),
  });
}

export async function getInbox(
  req: import("express").Request,
  res: Response,
) {
  if (!req.userId) throw new HttpError(401, "Unauthorized", "UNAUTHORIZED");
  const userOid = new mongoose.Types.ObjectId(req.userId);

  const grouped = await Message.aggregate<{
    _id: string;
    lastAt: Date;
    lastContent: string;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    unreadCount: number;
  }>([
    {
      $match: {
        $or: [{ senderId: userOid }, { receiverId: userOid }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$conversationId",
        lastAt: { $first: "$createdAt" },
        lastContent: { $first: "$content" },
        senderId: { $first: "$senderId" },
        receiverId: { $first: "$receiverId" },
        productId: { $first: "$productId" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [
                { $eq: ["$receiverId", userOid] },
                { $eq: ["$isRead", false] }
              ]},
              1,
              0
            ]
          }
        }
      },
    },
    { $sort: { lastAt: -1 } },
    { $limit: 50 },
  ]);

  const data = await Promise.all(
    grouped.map(async (row) => {
      const conversationId = row._id;
      const peerId = row.senderId.equals(userOid)
        ? row.receiverId
        : row.senderId;
      const [peer, product] = await Promise.all([
        User.findById(peerId).select("email").lean(),
        Product.findById(row.productId).select("title").lean(),
      ]);
      const peerLean = peer as { email?: string } | null;
      const productLean = product as { title?: string } | null;
      return {
        conversationId,
        peerId: String(peerId),
        peerEmail: peerLean?.email ?? null,
        productId: String(row.productId),
        productTitle: productLean?.title ?? "Listing",
        lastMessage: row.lastContent,
        lastAt: row.lastAt.toISOString(),
        unreadCount: row.unreadCount || 0,
      };
    }),
  );

  res.json({ data });
}

export async function getConversationMeta(
  req: import("express").Request,
  res: Response,
) {
  if (!req.userId) throw new HttpError(401, "Unauthorized", "UNAUTHORIZED");
  const { conversationId } = req.params;
  const parsed = parseConversationId(conversationId);
  if (!parsed || !userInConversation(conversationId, req.userId)) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }

  const peerId =
    parsed.userA === req.userId ? parsed.userB : parsed.userA;
  const [peer, product] = await Promise.all([
    User.findById(peerId).select("email").lean(),
    Product.findById(parsed.productId).select("title images").lean(),
  ]);
  const peerLean = peer as { email?: string } | null;
  const productLean = product as { title?: string; images?: string[] } | null;

  res.json({
    conversationId,
    peerId,
    peerEmail: peerLean?.email ?? null,
    productId: parsed.productId,
    productTitle: productLean?.title ?? "Listing",
    productImage: productLean?.images?.[0] ?? null,
  });
}
