import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

const ADMIN_EMAIL = "hniyen-admin@meicloset.com";
const ADMIN_PASSWORD = "hniyen@meicloset";

export async function seedAdminUser() {
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existing) {
      console.log(`[Seed] Admin user already exists: ${ADMIN_EMAIL}`);
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, env.BCRYPT_ROUNDS);
    
    await User.create({
      name: "Mei Admin",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    });

    console.log(`[Seed] Successfully created default admin account: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error(`[Seed] Error seeding admin user:`, error);
  }
}
