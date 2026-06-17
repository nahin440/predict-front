import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";
import { JWTPayload, Role, PERMISSIONS } from "@/types";
import { cookies } from "next/headers";

// ─── Cookie helpers ──────────────────────────────────────────────────────────
export const COOKIE_ACCESS = "xau_access";
export const COOKIE_REFRESH = "xau_refresh";

export function getAccessTokenFromRequest(req: NextRequest): string | null {
  // 1. Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  // 2. Cookie
  const cookie = req.cookies.get(COOKIE_ACCESS);
  return cookie?.value ?? null;
}

export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = getAccessTokenFromRequest(req);
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

// ─── RBAC ────────────────────────────────────────────────────────────────────
export function hasPermission(role: Role, permission: string): boolean {
  const perms = PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(permission);
}

export function isAdmin(role: Role): boolean {
  return role === "ADMIN";
}

export function canAccessPremium(role: Role): boolean {
  return ["ADMIN", "DEVELOPER", "PREMIUM_USER"].includes(role);
}

export function canManageContent(role: Role): boolean {
  return ["ADMIN", "DEVELOPER", "SEO_MANAGER", "MODERATOR"].includes(role);
}

// ─── Server-side cookie (for Server Components) ──────────────────────────────
export async function getServerUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ACCESS)?.value;
    if (!token) return null;
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}
