import { getPublicApiBaseUrl } from "@/lib/env";

export type UploadResult = {
  secureUrl: string;
  publicId: string;
};

/**
 * Uploads images to the backend.
 * @param token JWT access token
 * @param files Array of File objects
 * @returns Array of upload results containing secure URLs and public IDs
 */
export async function apiUploadImages(
  token: string,
  files: File[]
): Promise<UploadResult[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch(`${getPublicApiBaseUrl()}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: Do not set Content-Type header for FormData, 
      // the browser will set it with the correct boundary.
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Upload failed");
    throw new Error(errorText || `Upload failed with status ${res.status}`);
  }

  const json = (await res.json()) as { success: boolean; data: UploadResult[] };
  return json.data;
}
