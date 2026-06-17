import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Prediction from "@/models/Prediction";
import { getAuthUser, canAccessPremium } from "@/lib/auth/helpers";

const TRADER_FIELDS = ["confidence", "effective_confidence", "risk", "model_votes",
  "macro_adjusted_conf", "raw_prob_up", "exec_quality_score"];

const PRO_FIELDS = [...TRADER_FIELDS, "confluence", "structure", "fibonacci",
  "pattern_details", "active_patterns", "fibonacci", "vix", "yield_10y",
  "yield_change", "dxy_return", "pattern_confluence", "wave_pattern",
  "all_hard_blocks", "all_soft_failures"];

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = await getAuthUser(req);
    const role = auth?.role || "USER";
    const isPremiumRole = ["ADMIN", "DEVELOPER", "PREMIUM_USER"].includes(role);

    // Check subscription from token (stored in user DB)
    // For now use role-based access
    const plan = "free"; // Will be enhanced with DB lookup
    const isTrader = isPremiumRole || ["trader", "pro", "premium", "enterprise"].includes(plan);
    const isPro = isPremiumRole || ["pro", "premium", "enterprise"].includes(plan);

    const latest = await Prediction.findOne().sort({ timestamp: -1 }).lean() as Record<string, unknown> | null;
    if (!latest) return NextResponse.json({ success: false, error: "No predictions available" }, { status: 404 });

    // Free tier: direction, price, regime type, signal_strength, grade only
    if (!isTrader) {
      const safeData = {
        _id: latest._id,
        current_price: latest.current_price,
        direction: latest.direction,
        should_skip: latest.should_skip,
        skip_reason: latest.skip_reason,
        signal_strength: latest.signal_strength,
        timestamp: latest.timestamp,
        server_time: latest.server_time,
        session_name: latest.session_name,
        bear_htf_count: latest.bear_htf_count,
        bull_htf_count: latest.bull_htf_count,
        regime: { regime: (latest.regime as Record<string, unknown>)?.regime },
        confluence: {
          grade: (latest.confluence as Record<string, unknown>)?.grade,
          direction: (latest.confluence as Record<string, unknown>)?.direction,
        },
        adx: latest.adx,
        rsi: latest.rsi,
        atr: latest.atr,
      };
      return NextResponse.json({ success: true, data: safeData, tier: "free" });
    }

    // Pro tier: everything
    if (isPro) {
      return NextResponse.json({ success: true, data: latest, tier: "pro" });
    }

    // Trader tier: confidence + risk, no advanced analysis
    const traderData = { ...latest };
    const proOnlyFields = ["confluence", "structure", "fibonacci", "pattern_details",
      "active_patterns", "all_hard_blocks", "all_soft_failures", "wave_pattern", "fibonacci"];
    proOnlyFields.forEach(f => delete traderData[f]);

    return NextResponse.json({ success: true, data: traderData, tier: "trader" });
  } catch (err) {
    console.error("[PREDICTIONS/CURRENT]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
