import { Router } from "express";
import { aiRouter } from "./aiRoutes.js";
import { authRouter } from "./authRoutes.js";
import { wishlistRouter } from "./wishlistRoutes.js";
import { chatRouter } from "./chatRoutes.js";
import { productsRouter } from "./products.js";
import { adminRouter } from "./adminRoutes.js";
import { uploadRouter } from "./uploadRoutes.js";
import { orderRouter } from "./orderRoutes.js";

/** All paths are relative to mount point `/api`. */
export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/orders", orderRouter);
