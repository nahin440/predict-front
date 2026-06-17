import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { generateTokenPair } from "@/lib/auth/jwt";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/helpers";
import { AuditLog } from "@/models/index";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number")
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    // First user with admin email gets ADMIN role
    const adminEmail = process.env.ADMIN_EMAIL || "zubayer.nahin@gmail.com";
    const role = email === adminEmail ? "ADMIN" : "USER";

    const user = await User.create({ name, email, password, role, isVerified: role === "ADMIN" });

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokenPair(payload);

    // Store refresh token
    user.refreshTokens = [refreshToken];
    await user.save();

    await AuditLog.create({
      userId: user._id.toString(),
      userEmail: email,
      action: "REGISTER",
      resource: "User",
      resourceId: user._id.toString(),
      ip: req.headers.get("x-forwarded-for") || "unknown",
      success: true
    });

    const res = NextResponse.json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified, subscription: user.subscription },
        accessToken
      },
      message: "Account created successfully"
    }, { status: 201 });

    res.cookies.set(COOKIE_ACCESS, accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 15 * 60 });
    res.cookies.set(COOKIE_REFRESH, refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 });

    return res;
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
