import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getPredictionModel, isTimeframe, Timeframe } from "@/models/Prediction";
import { AuditLog } from "@/models/index";

// Timeframe is read from (in priority order): ?tf= query param, then
// body.timeframe, defaulting to "m15" for back-compat with any bot/client
// that hasn't been updated to send one yet.
function resolveTimeframe(req: NextRequest, body: Record<string, unknown>): Timeframe {
  const fromQuery = new URL(req.url).searchParams.get("tf");
  if (isTimeframe(fromQuery)) return fromQuery;
  const fromBody = body?.timeframe as string | undefined;
  if (isTimeframe(fromBody)) return fromBody;
  return "m15";
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate bot API key
    const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
    if (!apiKey || apiKey !== process.env.BOT_API_KEY) {
      return NextResponse.json({ success: false, error: "Invalid API key" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (!body.current_price || !body.direction) {
      return NextResponse.json({ success: false, error: "Missing required fields: current_price, direction" }, { status: 400 });
    }

    const tf = resolveTimeframe(req, body);
    const Prediction = getPredictionModel(tf);

    const prediction = await Prediction.create({
      ...body,
      saved_at: new Date(),
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      target_time: body.target_time ? new Date(body.target_time) : new Date()
    });

    await AuditLog.create({
      action: "PREDICTION_CREATED",
      resource: "Prediction",
      resourceId: prediction._id.toString(),
      details: { direction: body.direction, confidence: body.confidence, price: body.current_price, timeframe: tf },
      ip: req.headers.get("x-forwarded-for") || "bot",
      success: true
    });

    return NextResponse.json({ success: true, data: { _id: prediction._id, timeframe: tf }, message: "Prediction saved" }, { status: 201 });
  } catch (err) {
    console.error("[API/V1/PREDICTIONS]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.BOT_API_KEY) {
      return NextResponse.json({ success: false, error: "Invalid API key" }, { status: 401 });
    }

    await connectDB();
    const tf = resolveTimeframe(req, {});
    const Prediction = getPredictionModel(tf);
    const latest = await Prediction.findOne().sort({ timestamp: -1 }).lean();
    return NextResponse.json({ success: true, data: latest, timeframe: tf });
  } catch (err) {
    console.error("[API/V1/PREDICTIONS GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
