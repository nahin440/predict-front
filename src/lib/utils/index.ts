import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, decimals = 2): string {
  return price.toFixed(decimals);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

// ─── Bangladesh Standard Time (UTC+6, fixed — no DST) ──────────────────────
// Prediction timestamps are saved in UTC by the bot. All prediction-related
// display converts to Bangladesh time (Asia/Dhaka).
//
// This deliberately does NOT use `Intl.DateTimeFormat`'s `timeZone` option
// (e.g. `toLocaleString(..., { timeZone: "Asia/Dhaka" })`) even though that
// approach is correct wherever full ICU timezone data is available. The
// risk is environment dependence: correctness silently depends on the
// JS runtime having the IANA "Asia/Dhaka" zone loaded, and serverless
// platforms can ship a Node build with reduced or no ICU data — in which
// case `timeZone` is silently ignored with no error, and the "converted"
// time quietly falls back to server-local time (often UTC) instead.
// Bangladesh has used a single fixed UTC+6 offset with no daylight saving
// since 2009, so a plain +6 hour arithmetic shift is exact — it needs no
// timezone database at all, only `Date.getTime()` and the UTC getters,
// both of which are core ECMAScript and behave identically on every
// runtime. This removes the whole class of "does this environment's ICU
// data support this zone" risk rather than trying to detect or work
// around it.
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface DhakaParts {
  year: number; month: number; monthName: string; day: number;
  hour: number; minute: number; second: number;
}

// Shifts the instant by the fixed +6h offset, then reads calendar fields
// back out using the UTC getters on the shifted Date — this reads the
// *shifted* instant's fields as if they were UTC, which is exactly the
// Dhaka wall-clock time, with zero locale/ICU involvement anywhere in the
// call chain.
function toDhakaParts(dateLike: string | number | Date): DhakaParts {
  const utcMs = new Date(dateLike).getTime();
  const shifted = new Date(utcMs + DHAKA_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    monthName: MONTH_NAMES[shifted.getUTCMonth()],
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// "Aug 20, 04:27" — used for prediction history tables.
export function formatDhakaDateTime(dateLike: string | number | Date): string {
  const p = toDhakaParts(dateLike);
  return `${p.monthName} ${pad2(p.day)}, ${pad2(p.hour)}:${pad2(p.minute)}`;
}

// "04:27" — used for compact "last updated" labels.
export function formatDhakaTime(dateLike: string | number | Date): string {
  const p = toDhakaParts(dateLike);
  return `${pad2(p.hour)}:${pad2(p.minute)}`;
}

// Prediction timestamps are saved in UTC by the bot — display converts to
// Asia/Dhaka (BD time) using the fixed-offset arithmetic above, regardless
// of the server/browser's own timezone or ICU data availability.
// Do NOT pass a `server_time` field to this — that field is a
// human-readable string like "2026-08-19 22:27:29 UTC" (see backend
// shared/data_fetcher.py's fmt_time()), not a standard ISO format, and
// Date parsing of it is not reliably cross-engine. Always prefer
// `timestamp` (or `saved_at`/`createdAt` as fallbacks), which the bot
// writes via Python's datetime.isoformat() on a UTC-aware datetime —
// e.g. "2026-08-19T22:27:29.858940+00:00" — which parses correctly and
// consistently everywhere.
export function formatDate(date: string | Date): string {
  const p = toDhakaParts(date);
  return `${p.monthName} ${p.day}, ${p.year}, ${pad2(p.hour)}:${pad2(p.minute)}`;
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getSignalColor(direction: string, shouldSkip: boolean) {
  if (shouldSkip) return "text-obsidian-400";
  return direction === "UP" ? "text-emerald-400" : "text-red-400";
}

export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: "text-emerald-400", B: "text-green-400",
    C: "text-yellow-400", D: "text-orange-400", F: "text-red-400"
  };
  return map[grade] ?? "text-obsidian-400";
}

export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return "xau_" + Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local[0]}***@${domain}`;
}

export function getPlanColor(plan: string): string {
  const map: Record<string, string> = {
    free: "text-obsidian-400",
    pro: "text-blue-400",
    premium: "text-gold-400",
    enterprise: "text-purple-400"
  };
  return map[plan] ?? "text-obsidian-400";
}

export function sanitizeUser(user: Record<string, unknown>) {
  const { password, refreshTokens, emailVerificationToken, passwordResetToken, ...safe } = user;
  void password; void refreshTokens; void emailVerificationToken; void passwordResetToken;
  return safe;
}
