import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";
import { User } from "../models/User.js";

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    avatar: string | null;
    role: string;
    createdAt: string;
  };
  tokens: {
    accessToken: string;
    expiresIn: number;
  };
};

function issueToken(userId: string): { token: string; expiresIn: number } {
  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  const token = jwt.sign({ sub: userId }, env.JWT_SECRET, signOptions);
  const payload = jwt.decode(token) as { exp?: number };
  const expiresIn =
    payload?.exp != null
      ? Math.max(1, payload.exp - Math.floor(Date.now() / 1000))
      : 3600;
  return { token, expiresIn };
}

function serializeUser(user: any) {
  return {
    id: user._id.toString(),
    email: user.email,
    avatar: user.avatar,
    role: user.role ?? "user",
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new HttpError(400, "Email already in use", "BAD_REQUEST");
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
  });

  const { token, expiresIn } = issueToken(user._id.toString());
  return {
    user: serializeUser(user),
    tokens: { accessToken: token, expiresIn },
  };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  
  if (!user?.passwordHash) {
    throw new HttpError(401, "Invalid email or password", "UNAUTHORIZED");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, "Invalid email or password", "UNAUTHORIZED");
  }

  const { token, expiresIn } = issueToken(user._id.toString());
  return {
    user: serializeUser(user),
    tokens: { accessToken: token, expiresIn },
  };
}

export async function getMeService(userId: string): Promise<AuthResponse["user"]> {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError(404, "User not found", "NOT_FOUND");
  }
  return serializeUser(user);
}
