import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { getAuthUser, isAdmin } from "@/lib/auth/helpers";
import { AuditLog } from "@/models/index";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || !["ADMIN", "DEVELOPER", "MODERATOR"].includes(auth.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];

    const [users, total] = await Promise.all([
      User.find(query).select("-password -refreshTokens").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(query)
    ]);

    return NextResponse.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[ADMIN/USERS GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || !isAdmin(auth.role)) {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { userId, role, isActive, subscription } = await req.json();
    if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (role) update.role = role;
    if (typeof isActive === "boolean") update.isActive = isActive;
    if (subscription) update.subscription = subscription;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password -refreshTokens");
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    await AuditLog.create({
      userId: auth.userId,
      userEmail: auth.email,
      action: "USER_UPDATED",
      resource: "User",
      resourceId: userId,
      details: update,
      success: true
    });

    return NextResponse.json({ success: true, data: user, message: "User updated" });
  } catch (err) {
    console.error("[ADMIN/USERS PATCH]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
