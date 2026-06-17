import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { generateTokenPair } from "@/lib/auth/jwt";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/helpers";
import { AuditLog } from "@/models/index";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Check account lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ success: false, error: `Account locked. Try again in ${remaining} minutes.` }, { status: 429 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: "Account is deactivated" }, { status: 403 });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      await user.save();

      await AuditLog.create({ userId: user._id.toString(), userEmail: email, action: "LOGIN_FAILED", resource: "Auth", ip, success: false });
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokenPair(payload);

    // Rotate refresh tokens (keep last 5)
    user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
    await user.save();

    await AuditLog.create({ userId: user._id.toString(), userEmail: email, action: "LOGIN", resource: "Auth", ip, success: true });

    const res = NextResponse.json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified, subscription: user.subscription, avatar: user.avatar },
        accessToken
      },
      message: "Login successful"
    });

    res.cookies.set(COOKIE_ACCESS, accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 15 * 60 });
    res.cookies.set(COOKIE_REFRESH, refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 });

    return res;
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
