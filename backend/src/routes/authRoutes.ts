import { Router } from "express";
import passport from "passport";
import { asyncHandler } from "../lib/asyncHandler.js";
import { login, register, getMe, oauthCallback } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", authenticate, asyncHandler(getMe));

authRouter.get(
  "/google",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${process.env.CORS_ORIGIN || "http://localhost:3000"}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }
);

authRouter.get(
  "/google/callback",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${process.env.CORS_ORIGIN || "http://localhost:3000"}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("google", { failureRedirect: "/login?error=OAuthFailed" })(req, res, next);
  },
  oauthCallback
);

authRouter.get(
  "/facebook",
  (req, res, next) => {
    if (!process.env.FACEBOOK_APP_ID) {
      return res.redirect(`${process.env.CORS_ORIGIN || "http://localhost:3000"}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }
);

authRouter.get(
  "/facebook/callback",
  (req, res, next) => {
    if (!process.env.FACEBOOK_APP_ID) {
      return res.redirect(`${process.env.CORS_ORIGIN || "http://localhost:3000"}/login?error=OAuthNotConfigured`);
    }
    passport.authenticate("facebook", { failureRedirect: "/login?error=OAuthFailed" })(req, res, next);
  },
  oauthCallback
);
