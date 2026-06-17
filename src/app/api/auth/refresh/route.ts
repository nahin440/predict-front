import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { verifyRefreshToken, generateTokenPair } from "@/lib/auth/jwt";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/helpers";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(COOKIE_REFRESH)?.value;
    if (!refreshToken) return NextResponse.json({ success: false, error: "No refresh token" }, { status: 401 });

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });

    if (!user.refreshTokens?.includes(refreshToken)) {
      // Token reuse detected - clear all refresh tokens
      user.refreshTokens = [];
      await user.save();
      return NextResponse.json({ success: false, error: "Token reuse detected" }, { status: 401 });
    }

    const newPayload = { userId: user._id.toString(), email: user.email, role: user.role };
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(newPayload);

    // Rotate: remove old, add new
    user.refreshTokens = [...user.refreshTokens.filter((t: string) => t !== refreshToken), newRefreshToken];
    await user.save();

    const res = NextResponse.json({ success: true, data: { accessToken } });
    res.cookies.set(COOKIE_ACCESS, accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 15 * 60 });
    res.cookies.set(COOKIE_REFRESH, newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 });
    return res;
  } catch (err) {
    console.error("[REFRESH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
