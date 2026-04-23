import type { Request, Response } from "express";
import { uploadToCloudinary } from "../services/uploadService.js";
import { sendFailure, sendSuccess } from "../lib/response.js";

export async function uploadMultipleImages(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return sendFailure(res, 400, "No files uploaded");
    }

    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);

    sendSuccess(res, results);
  } catch (err) {
    console.error("Upload Error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error during upload";
    sendFailure(res, 500, msg);
  }
}
