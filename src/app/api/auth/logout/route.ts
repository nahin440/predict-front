import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS, COOKIE_REFRESH } from "@/lib/auth/helpers";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.delete(COOKIE_ACCESS);
  res.cookies.delete(COOKIE_REFRESH);
  return res;
}
