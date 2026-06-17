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

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  }).format(new Date(date));
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
