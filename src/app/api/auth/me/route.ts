import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth/helpers";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(auth.userId).select("-password -refreshTokens -emailVerificationToken -passwordResetToken");
    if (!user || !user.isActive) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("[ME]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
