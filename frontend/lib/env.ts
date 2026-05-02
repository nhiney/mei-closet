/**
 * Public env vars only (exposed to the browser). Never put secrets here.
 */
export function getPublicApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is required in production");
    }
    return "http://localhost:3001/api";
  }
  
  return url.endsWith("/api") ? url : `${url}/api`;
}

/** Origin for Socket.io (same host as API, without `/api`). */
export function getSocketOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SOCKET_ORIGIN?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  
  try {
    const apiBase = getPublicApiBaseUrl();
    return new URL(apiBase).origin;
  } catch {
    return "http://localhost:3001";
  }
}
