import { getPublicApiBaseUrl } from "@/lib/env";

export async function generateProductDescription(
  token: string,
  body: {
    title: string;
    condition: "new" | "like_new" | "good" | "fair";
    keywords?: string;
  },
): Promise<string> {
  const res = await fetch(
    `${getPublicApiBaseUrl()}/ai/product-description`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    let msg = "AI request failed";
    try {
      const err = (await res.json()) as { error?: { message?: string } };
      if (err.error?.message) msg = err.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const data = (await res.json()) as { description?: string };
  if (!data.description) throw new Error("Empty AI response");
  return data.description;
}
