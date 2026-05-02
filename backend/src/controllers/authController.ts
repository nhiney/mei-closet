import type { Response, Request } from "express";
import { z } from "zod";
import * as authService from "../services/authService.js";
import { env } from "../config/env.js";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function register(req: Request, res: Response) {
  const body = credentialsSchema.parse(req.body);
  const data = await authService.registerUser(body.email, body.password, req.ip);
  res.status(201).json(data);
}

export async function login(req: Request, res: Response) {
  const body = credentialsSchema.parse(req.body);
  const data = await authService.loginUser(body.email, body.password, req.ip);
  res.json(data);
}

export async function getMe(req: Request, res: Response) {
  const userId = (req as any).user?.sub;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await authService.getMeService(userId);
  res.json(user);
}

export async function oauthCallback(req: Request, res: Response) {
  const user = req.user as any;
  if (!user) {
    res.redirect(`${env.CORS_ORIGIN}/login?error=OAuthFailed`);
    return;
  }

  // Issue token and update lastLogin
  const { token } = await authService.issueToken(user._id.toString(), req.ip);

  // Redirect to success page with tokens
  const redirectUrl = new URL(`${env.CORS_ORIGIN}/auth/success`);
  redirectUrl.searchParams.set("token", token);
  redirectUrl.searchParams.set("userId", user._id.toString());
  redirectUrl.searchParams.set("email", user.email);

  res.redirect(redirectUrl.toString());
}
