import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

function port(): number {
  const raw = process.env.PORT;
  if (!raw) return 5050;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 5050;
}

function mongoUri(): string {
  const fromEnv = process.env.MONGODB_URI?.trim();
  if (fromEnv) return fromEnv;
  if (isProd) {
    throw new Error("MONGODB_URI is required in production");
  }
  return "mongodb://127.0.0.1:27017/mei-closet";
}

function jwtSecret(): string {
  const fromEnv = process.env.JWT_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (isProd) {
    throw new Error("JWT_SECRET is required in production");
  }
  return "dev-insecure-change-me";
}

function bcryptRounds(): number {
  const raw = process.env.BCRYPT_ROUNDS;
  if (!raw) return 12;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 10 && n <= 15 ? n : 12;
}

function openAiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

function oauthKey(provider: string, type: "ID" | "SECRET" | "APP_ID" | "APP_SECRET"): string | undefined {
  return process.env[`${provider}_${type}`]?.trim() || undefined;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  isProd,
  PORT: port(),
  MONGODB_URI: mongoUri(),
  CORS_ORIGIN: (process.env.CORS_ORIGIN?.trim() ?? "http://localhost:3001").replace(/\/$/, ""),
  JWT_SECRET: jwtSecret(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN?.trim() ?? "7d",
  BCRYPT_ROUNDS: bcryptRounds(),
  BACKEND_URL: (process.env.BACKEND_URL?.trim() ?? (isProd ? "" : "http://localhost:5050")).replace(/\/$/, ""),
  OPENAI_API_KEY: openAiKey(),
  OPENAI_MODEL: process.env.OPENAI_MODEL?.trim() ?? "gpt-4o-mini",
  GOOGLE_CLIENT_ID: oauthKey("GOOGLE_CLIENT", "ID"),
  GOOGLE_CLIENT_SECRET: oauthKey("GOOGLE_CLIENT", "SECRET"),
  FACEBOOK_APP_ID: oauthKey("FACEBOOK", "APP_ID"),
  FACEBOOK_APP_SECRET: oauthKey("FACEBOOK", "APP_SECRET"),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim(),
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim(),
} as const;
