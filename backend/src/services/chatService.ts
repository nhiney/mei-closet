import mongoose from "mongoose";
import { Message, MessageDoc } from "../models/Message.js";
import { Product } from "../models/Product.js";

export type SerializedMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export function serializeMessage(doc: MessageDoc): SerializedMessage {
  return {
    id: doc._id.toString(),
    senderId: doc.senderId.toString(),
    receiverId: doc.receiverId.toString(),
    productId: doc.productId.toString(),
    content: doc.content,
    isRead: doc.isRead,
    createdAt: (doc.createdAt as Date).toISOString(),
  };
}

export async function saveMessageService(data: {
  senderId: string;
  receiverId: string;
  productId: string;
  content: string;
}): Promise<SerializedMessage> {
  const message = await Message.create(data);
  return serializeMessage(message.toObject() as MessageDoc);
}

export async function getConversationMessagesService(
  productId: string,
  userA: string,
  userB: string
): Promise<SerializedMessage[]> {
  const messages = await Message.find({
    productId,
    $or: [
      { senderId: userA, receiverId: userB },
      { senderId: userB, receiverId: userA },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return messages.map((m) => serializeMessage(m as any as MessageDoc));
}

export async function getUserConversationsService(userId: string): Promise<any[]> {
  // Aggregate to find unique combinations of product + other user
  const results = await Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(userId) },
          { receiverId: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          productId: "$productId",
          otherUser: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId",
            ],
          },
        },
        lastMessage: { $first: "$content" },
        lastTimestamp: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", new mongoose.Types.ObjectId(userId)] },
                  { $eq: ["$isRead", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { lastTimestamp: -1 } },
  ]);

  // Populate product and user info
  const populated = await Promise.all(
    results.map(async (res) => {
      const [product, otherUser] = await Promise.all([
        Product.findById(res._id.productId).select("title images").lean(),
        mongoose.model("User").findById(res._id.otherUser).select("email name").lean(),
      ]);
      return {
        id: `${res._id.productId}:${res._id.otherUser}`,
        productId: res._id.productId,
        product,
        otherUser,
        lastMessage: res.lastMessage,
        lastTimestamp: res.lastTimestamp,
        unreadCount: res.unreadCount,
      };
    })
  );

  return populated.filter(p => p.product && p.otherUser);
}

export async function markAsReadService(
  productId: string,
  receiverId: string,
  senderId: string
): Promise<void> {
  await Message.updateMany(
    {
      productId,
      receiverId,
      senderId,
      isRead: false,
    },
    { $set: { isRead: true } }
  );
}
