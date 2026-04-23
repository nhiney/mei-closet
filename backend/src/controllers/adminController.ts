import type { Request, Response } from "express";
import { sendFailure, sendSuccess } from "../lib/response.js";
import { getDashboardMetrics } from "../services/adminService.js";

export async function getAdminMetrics(_req: Request, res: Response) {
  try {
    const metrics = await getDashboardMetrics();
    sendSuccess(res, metrics);
  } catch (err) {
    console.error("Admin Metrics Error:", err);
    sendFailure(res, 500, "Internal server error fetching metrics");
  }
}
