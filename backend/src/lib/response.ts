import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  data: T,
  status: number = 200,
): void {
  res.status(status).json({ success: true, data });
}

export function sendFailure(
  res: Response,
  status: number,
  message: string,
): void {
  res.status(status).json({ success: false, message });
}
