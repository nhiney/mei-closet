import { getPublicApiBaseUrl } from "@/lib/env";
import type { ApiErrorBody } from "./types";

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    role: string;
    avatar: string | null;
    createdAt: string;
  };
  tokens: { accessToken: string; expiresIn: number };
};

async function parseAuthError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return body?.error?.message ?? `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${getPublicApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseAuthError(res));
  return (await res.json()) as AuthResponse;
}

export async function apiRegister(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${getPublicApiBaseUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseAuthError(res));
  return (await res.json()) as AuthResponse;
}
