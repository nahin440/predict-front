import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth/helpers";
import { z } from "zod";

const Schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, number")
});

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });

    await connectDB();
    const user = await User.findById(auth.userId).select("+password");
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const valid = await user.comparePassword(parsed.data.currentPassword);
    if (!valid) return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });

    user.password = parsed.data.newPassword;
    user.refreshTokens = []; // invalidate all sessions
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated. Please log in again." });
  } catch (err) {
    console.error("[CHANGE-PASSWORD]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
