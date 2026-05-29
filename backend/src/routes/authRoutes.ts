import { Router } from "express";
import passport from "passport";
import { asyncHandler } from "../lib/asyncHandler.js";
import { login, register, getMe, oauthCallback } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { env } from "../config/env.js";

export const authRouter = Router();

authRouter.get("/test", (_req, res) => res.json({ message: "Auth routes are working" }));
authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", authenticate, asyncHandler(getMe));

authRouter.get(
  "/google",
  (req, res, next) => {
    if (!env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${env.APP_URL}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }
);

authRouter.get(
  "/google/callback",
  (req, res, next) => {
    if (!env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${env.APP_URL}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("google", { failureRedirect: `${env.APP_URL}/login?error=OAuthFailed` })(req, res, next);
  },
  oauthCallback
);

authRouter.get(
  "/facebook",
  (req, res, next) => {
    if (!env.FACEBOOK_APP_ID) {
      return res.redirect(`${env.APP_URL}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }
);

authRouter.get(
  "/facebook/callback",
  (req, res, next) => {
    if (!env.FACEBOOK_APP_ID) {
      return res.redirect(`${env.APP_URL}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("facebook", { failureRedirect: `${env.APP_URL}/login?error=OAuthFailed` })(req, res, next);
  },
  oauthCallback
);
