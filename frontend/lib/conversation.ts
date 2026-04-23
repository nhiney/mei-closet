/** Must match server `buildConversationId`. */
export function buildConversationId(
  userIdA: string,
  userIdB: string,
  productId: string,
): string {
  const [a, b] = [userIdA, userIdB].sort();
  return `${a}_${b}_${productId}`;
}

export function parseConversationId(id: string) {
  const parts = id.split("_");
  if (parts.length !== 3) return null;
  return {
    userA: parts[0],
    userB: parts[1],
    productId: parts[2],
  };
}
