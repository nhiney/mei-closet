import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport.js";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.use(
    session({
      secret: env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: env.isProd, maxAge: 24 * 60 * 60 * 1000 },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.isProd ? "combined" : "dev"));
  }

  app.get("/", (_req, res) => {
    res.json({
      message: "API is running",
      api: "/api",
    });
  });

  // Quick discovery when opening http://localhost:4000/api in the browser.
  app.get("/api", (_req, res) => {
    res.json({
      message: "Mei Closet API",
      endpoints: {
        health: "/api/health",
        products: "/api/products (GET list, POST create, GET/:id, PUT/:id, DELETE/:id)",
        authRegister: "/api/auth/register",
        authLogin: "/api/auth/login",
        favorites: "/api/favorites",
        messages: "/api/messages",
        ai: "/api/ai/product-description",
      },
    });
  });

  // Browsers request /favicon.ico by default; API has no asset → avoid noisy 404.
  app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
