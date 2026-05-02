import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMongo, disconnectMongo } from "./config/db.js";
import { initSocket } from "./socket/index.js";
import { seedAdminUser } from "./seed/adminSeed.js";

const app = createApp();
const server = createServer(app);
initSocket(server);

async function main() {
  try {
    await connectMongo(env.MONGODB_URI);
    await seedAdminUser();
  } catch (err) {
    console.error("❌ MongoDB connection failed. Server will start in limited mode.", err);
  }

  server.listen(env.PORT, () => {
    console.log(
      `API listening on http://localhost:${env.PORT} (env: ${env.NODE_ENV})`,
    );
  });
}

function shutdown(signal: string) {
  return async () => {
    console.log(`${signal} received, shutting down…`);
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    await disconnectMongo();
    process.exit(0);
  };
}

process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGTERM"));

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
