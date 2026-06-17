import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth/helpers";

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { name, avatar } = await req.json();
    const update: Record<string, unknown> = {};
    if (name && name.trim().length >= 2) update.name = name.trim();
    if (avatar) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(auth.userId, update, { new: true })
      .select("-password -refreshTokens");
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user, message: "Profile updated" });
  } catch (err) {
    console.error("[USER/PROFILE]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
