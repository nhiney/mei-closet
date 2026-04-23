import type { Response } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";

const bodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  keywords: z.string().trim().max(200).optional(),
});

export async function generateProductDescription(
  req: import("express").Request,
  res: Response,
) {
  if (!req.userId) throw new HttpError(401, "Unauthorized", "UNAUTHORIZED");
  if (!env.OPENAI_API_KEY) {
    throw new HttpError(
      503,
      "AI is not configured (missing OPENAI_API_KEY)",
      "SERVICE_UNAVAILABLE",
    );
  }

  const body = bodySchema.parse(req.body);
  const userLine = `Write 2–4 short sentences of plain text (no hashtags, no bullet list) for a Depop-style secondhand listing titled "${body.title}". Condition: ${body.condition}. Tone: Gen Z friendly, honest, minimal hype.${body.keywords ? ` Extra hints: ${body.keywords}` : ""}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You write concise secondhand fashion marketplace descriptions. Plain sentences only.",
        },
        { role: "user", content: userLine },
      ],
      max_tokens: 220,
      temperature: 0.7,
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    console.error("OpenAI error", r.status, t);
    throw new HttpError(502, "AI provider error", "BAD_GATEWAY");
  }

  const data = (await r.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new HttpError(502, "Empty AI response", "BAD_GATEWAY");
  }

  res.json({ description: text });
}
