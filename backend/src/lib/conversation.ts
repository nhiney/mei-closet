import mongoose from "mongoose";

/** Stable id for a buyer–seller thread about one product (two user ObjectIds + productId). */
export function buildConversationId(
  userIdA: string,
  userIdB: string,
  productId: string,
): string {
  const [a, b] = [userIdA, userIdB].sort();
  return `${a}_${b}_${productId}`;
}

export function parseConversationId(
  conversationId: string,
):
  | { userA: string; userB: string; productId: string }
  | null {
  const parts = conversationId.split("_");
  if (parts.length !== 3) return null;
  const [userA, userB, productId] = parts;
  if (
    !mongoose.Types.ObjectId.isValid(userA) ||
    !mongoose.Types.ObjectId.isValid(userB) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return null;
  }
  return { userA, userB, productId };
}

export function userInConversation(
  conversationId: string,
  userId: string,
): boolean {
  const p = parseConversationId(conversationId);
  if (!p) return false;
  return p.userA === userId || p.userB === userId;
}
