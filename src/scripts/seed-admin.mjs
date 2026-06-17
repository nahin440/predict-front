#!/usr/bin/env node
/**
 * Seed script — ensures zubayer.nahin@gmail.com exists as ADMIN
 * No password needed — login is via Google only
 * Run: npm run seed
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manually parse .env.local without dotenv dependency
function loadEnv() {
  const envPath = join(__dirname, "../../.env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // Strip surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
    console.log("✅ Loaded .env.local");
  } catch {
    console.warn("⚠️  Could not read .env.local — using existing environment variables");
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "xau_dashboard";
const ADMIN_EMAIL = "zubayer.nahin@gmail.com";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set. Check your .env.local file.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  password: String,
  role: { type: String, default: "USER" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  firebaseUid: String,
  loginAttempts: { type: Number, default: 0 },
  refreshTokens: [String],
  subscription: {
    plan: { type: String, default: "premium" },
    status: { type: String, default: "active" }
  }
}, { timestamps: true });

async function seed() {
  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DATABASE });
  console.log("✅ Connected to database:", MONGODB_DATABASE);

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.role = "ADMIN";
    existing.isVerified = true;
    existing.isActive = true;
    existing.name = existing.name || "Zubayer Nahin";
    existing.subscription = { plan: "premium", status: "active" };
    await existing.save();
    console.log(`✅ Admin updated: ${ADMIN_EMAIL}`);
    console.log(`   Role    → ADMIN`);
    console.log(`   Plan    → premium`);
    console.log(`   Verified→ true`);
  } else {
    await User.create({
      email: ADMIN_EMAIL,
      name: "Zubayer Nahin",
      role: "ADMIN",
      isVerified: true,
      isActive: true,
      subscription: { plan: "premium", status: "active" }
    });
    console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
  }

  console.log(`\n👉 Go to /auth/login → click "Continue with Google"`);
  console.log(`   Sign in with: ${ADMIN_EMAIL}`);
  console.log(`   You will be redirected to /admin automatically.\n`);

  await mongoose.disconnect();
  console.log("✅ Done.");
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
