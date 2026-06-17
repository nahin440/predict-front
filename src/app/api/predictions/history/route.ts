import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Prediction from "@/models/Prediction";
import { getAuthUser } from "@/lib/auth/helpers";

const PREMIUM_ROLES = ["ADMIN", "DEVELOPER", "PREMIUM_USER"];
const PREMIUM_PLANS = ["trader", "pro", "premium", "enterprise"];

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

    const isPremium = PREMIUM_ROLES.includes(auth.role);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");

    // Free: last 3 direction-only, Trader: 30 days with confidence, Pro: unlimited
    const limit = isPremium ? parseInt(searchParams.get("limit") || "50") : 3;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      Prediction.countDocuments({})
    ]);

    // Cast to unknown array
    const docs = predictions as unknown as Record<string, unknown>[];

    let data: Record<string, unknown>[];
    if (isPremium) {
      data = docs; // full data for admins/devs
    } else {
      // Free: direction, price, regime only
      data = docs.map(p => ({
        _id: p._id,
        current_price: p.current_price,
        direction: p.direction,
        should_skip: p.should_skip,
        signal_strength: p.signal_strength,
        timestamp: p.timestamp,
        saved_at: p.saved_at,
        session_name: p.session_name,
        regime: { regime: (p.regime as Record<string, unknown>)?.regime },
        confluence: { grade: (p.confluence as Record<string, unknown>)?.grade }
      }));
    }

    return NextResponse.json({
      success: true,
      data,
      isPremium,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error("[PREDICTIONS/HISTORY]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
