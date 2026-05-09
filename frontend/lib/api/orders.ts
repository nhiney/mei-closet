import { getPublicApiBaseUrl } from "@/lib/env";
import type {
  ApiOrder,
  ApiResponse,
  ApiFailureBody,
  CreateOrderRequest,
} from "./types";

async function readErrorMessage(res: Response): Promise<string> {
  const message = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    if (body && typeof body.message === "string") return body.message;
  } catch { /* ignore */ }
  return message;
}

export async function apiCreateOrder(
  accessToken: string,
  body: CreateOrderRequest
): Promise<ApiOrder> {
  const res = await fetch(`${getPublicApiBaseUrl()}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await readErrorMessage(res));

  const json = (await res.json()) as ApiResponse<ApiOrder>;
  return json.data;
}

export async function apiListOrders(accessToken: string): Promise<ApiOrder[]> {
  const res = await fetch(`${getPublicApiBaseUrl()}/orders`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(await readErrorMessage(res));

  const json = (await res.json()) as ApiResponse<ApiOrder[]>;
  return json.data;
}

export async function apiGetOrder(accessToken: string, id: string): Promise<ApiOrder> {
  const res = await fetch(`${getPublicApiBaseUrl()}/orders/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(await readErrorMessage(res));

  const json = (await res.json()) as ApiResponse<ApiOrder>;
  return json.data;
}

export async function apiCancelOrder(accessToken: string, id: string): Promise<ApiOrder> {
  const res = await fetch(`${getPublicApiBaseUrl()}/orders/${id}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(await readErrorMessage(res));

  const json = (await res.json()) as ApiResponse<ApiOrder>;
  return json.data;
}
