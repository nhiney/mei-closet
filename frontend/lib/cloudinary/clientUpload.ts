export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`${name} is not configured`);
  }
  return value.trim();
}

/**
 * Unsigned upload using an upload preset (configure in Cloudinary dashboard).
 * Preset should restrict folder / transformations suitable for public uploads.
 */
export async function uploadImageToCloudinary(
  file: File,
): Promise<CloudinaryUploadResult> {
  const cloudName = requireEnv(
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  );
  const uploadPreset = requireEnv(
    "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Each image must be 8MB or smaller.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text ? `Cloudinary upload failed: ${text}` : "Upload failed");
  }

  const data = (await res.json()) as {
    secure_url?: string;
    public_id?: string;
  };

  if (!data.secure_url || !data.public_id) {
    throw new Error("Unexpected Cloudinary response");
  }

  return { secureUrl: data.secure_url, publicId: data.public_id };
}
