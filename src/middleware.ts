import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS } from "@/lib/auth/helpers";

// ─── Middleware is LIGHTWEIGHT — no heavy JWT verify here ─────────────────────
// We only check if the cookie EXISTS (not expired validation).
// Real auth validation happens inside each API route / layout.
// This prevents the "cookie set but middleware rejects" race condition.

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/forgot-password"];
const PROTECTED_PATHS = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow API, static files, public assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasCookie = !!req.cookies.get(COOKIE_ACCESS)?.value;

  // If logged in and trying to access auth pages → send straight to the
  // live signal page (not the dashboard). Middleware only sees whether the
  // cookie exists, not the user's role, so it can't safely branch admins to
  // /admin here — but /predictions is public and correct for both, and
  // admins can reach /admin via the sidebar link from there.
  if (hasCookie && AUTH_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/predictions", req.url));
  }

  // Protected routes: only block if NO cookie at all
  // (If cookie is expired, the layout's useAuth will handle redirect cleanly)
  if (!hasCookie && PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
