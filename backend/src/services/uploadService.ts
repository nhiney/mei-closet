import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

// Initialize Cloudinary
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export type UploadResult = {
  secureUrl: string;
  publicId: string;
};

/**
 * Uploads a file buffer to Cloudinary.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "mei-closet/products"
): Promise<UploadResult> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured on the server.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(new Error(error.message));
        if (!result) return reject(new Error("Cloudinary upload failed with no result"));
        
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}
