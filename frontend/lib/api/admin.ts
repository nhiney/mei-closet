import { getPublicApiBaseUrl } from "../env";
import { ApiResponse } from "./types";
import { loadSession } from "../auth/session";

export type AdminMetrics = {
  totalProducts: number;
  totalMessages: number;
  totalViews: number;
  knitwearStats: {
    total: number;
    views: number;
  };
  topProductsByViews: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  topProductsByWishlist: Array<{
    id: string;
    title: string;
    wishlistCount: number;
  }>;
};

export async function fetchDashboardMetrics(): Promise<ApiResponse<AdminMetrics>> {
  const session = loadSession();
  if (!session) throw new Error("Authentication required");

  const res = await fetch(`${getPublicApiBaseUrl()}/admin/metrics`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 403) throw new Error("Access denied: Admin only");
    throw new Error("Failed to fetch dashboard metrics");
  }

  return res.json();
}
