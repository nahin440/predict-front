import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Prediction from "@/models/Prediction";
import { AuditLog } from "@/models/index";

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
      details: { direction: body.direction, confidence: body.confidence, price: body.current_price },
      ip: req.headers.get("x-forwarded-for") || "bot",
      success: true
    });

    return NextResponse.json({ success: true, data: { _id: prediction._id }, message: "Prediction saved" }, { status: 201 });
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
    const latest = await Prediction.findOne().sort({ timestamp: -1 }).lean();
    return NextResponse.json({ success: true, data: latest });
  } catch (err) {
    console.error("[API/V1/PREDICTIONS GET]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
