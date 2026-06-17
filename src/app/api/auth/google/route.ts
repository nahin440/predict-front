import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { generateTokenPair } from "@/lib/auth/jwt";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/helpers";
import { AuditLog } from "@/models/index";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { uid, email, name, photoURL } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ success: false, error: "Missing Firebase credentials" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "zubayer.nahin@gmail.com";

    // Find or create user
    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });

    if (!user) {
      // New user via Google
      const role = email === adminEmail ? "ADMIN" : "USER";
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        firebaseUid: uid,
        avatar: photoURL || undefined,
        role,
        isVerified: true, // Google accounts are pre-verified
        subscription: { plan: "free", status: "active" }
      });
    } else {
      // Update firebase uid and avatar if missing
      if (!user.firebaseUid) user.firebaseUid = uid;
      if (!user.avatar && photoURL) user.avatar = photoURL;
      if (!user.isVerified) user.isVerified = true;
      // Promote to admin if email matches
      if (email === adminEmail && user.role !== "ADMIN") user.role = "ADMIN";
      user.lastLogin = new Date();
      await user.save();
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: "Account is deactivated" }, { status: 403 });
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokenPair(payload);

    user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
    await user.save();

    await AuditLog.create({
      userId: user._id.toString(),
      userEmail: email,
      action: "GOOGLE_LOGIN",
      resource: "Auth",
      ip: req.headers.get("x-forwarded-for") || "unknown",
      success: true
    });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const
    };

    const res = NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          subscription: user.subscription,
          avatar: user.avatar
        },
        accessToken
      },
      message: "Signed in with Google"
    });

    res.cookies.set(COOKIE_ACCESS, accessToken, { ...cookieOpts, maxAge: 15 * 60 });
    res.cookies.set(COOKIE_REFRESH, refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 });

    return res;
  } catch (err) {
    console.error("[AUTH/GOOGLE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
