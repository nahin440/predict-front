import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Prediction from "@/models/Prediction";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    const [total, skipped, up, down, winData] = await Promise.all([
      Prediction.countDocuments(),
      Prediction.countDocuments({ should_skip: true }),
      Prediction.countDocuments({ direction: "UP", should_skip: false }),
      Prediction.countDocuments({ direction: "DOWN", should_skip: false }),
      Prediction.aggregate([
        { $match: { outcome: { $in: ["WIN", "LOSS"] } } },
        { $group: { _id: "$outcome", count: { $sum: 1 } } }
      ])
    ]);

    const wins = winData.find((d: {_id: string}) => d._id === "WIN")?.count || 0;
    const losses = winData.find((d: {_id: string}) => d._id === "LOSS")?.count || 0;
    const totalOutcomes = wins + losses;
    const winRate = totalOutcomes > 0 ? (wins / totalOutcomes) * 100 : 0;

    const avgConf = await Prediction.aggregate([
      { $match: { should_skip: false } },
      { $group: { _id: null, avg: { $avg: "$confidence" } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalPredictions: total,
        skippedTrades: skipped,
        totalTrades: total - skipped,
        bullSignals: up,
        bearSignals: down,
        winRate: Math.round(winRate * 10) / 10,
        wins,
        losses,
        avgConfidence: Math.round((avgConf[0]?.avg || 0) * 10) / 10,
        accuracy: Math.round(winRate * 10) / 10
      }
    });
  } catch (err) {
    console.error("[PREDICTIONS/STATS]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
