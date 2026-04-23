import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../lib/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { uploadMultipleImages } from "../controllers/uploadController.js";

export const uploadRouter = Router();

// Multer memory storage configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB limit per file
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * POST /api/upload
 * Requires authentication
 */
uploadRouter.post(
  "/",
  authenticate,
  upload.array("images", 10), // Allow up to 10 images
  asyncHandler(uploadMultipleImages)
);
