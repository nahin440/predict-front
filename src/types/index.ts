// ─── Roles & Permissions ───────────────────────────────────────────────────
export type Role = "ADMIN" | "DEVELOPER" | "SEO_MANAGER" | "MODERATOR" | "PREMIUM_USER" | "USER";

export const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["*"],
  DEVELOPER: ["read:all", "write:predictions", "write:blog", "read:admin"],
  SEO_MANAGER: ["read:all", "write:blog", "write:seo"],
  MODERATOR: ["read:all", "write:blog", "manage:users"],
  PREMIUM_USER: ["read:premium", "read:predictions:full"],
  USER: ["read:predictions:basic"]
};

// ─── User ───────────────────────────────────────────────────────────────────
export interface IUser {
  _id: string;
  email: string;
  name: string;
  password?: string;
  role: Role;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  firebaseUid?: string;
  subscription?: {
    plan: "free" | "pro" | "premium" | "enterprise";
    status: "active" | "cancelled" | "expired" | "trialing";
    expiresAt?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  apiKey?: string;
  loginAttempts: number;
  lockUntil?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// ─── Prediction ─────────────────────────────────────────────────────────────
export interface IPrediction {
  _id: string;
  server_time: string;
  timestamp: string;
  target_time: string;
  current_price: number;
  direction: "UP" | "DOWN";
  confidence: number;
  effective_confidence: number;
  prob_up: number;
  should_skip: boolean;
  skip_reason?: string;
  skip_priority: number;
  horizon: number;
  adx: number;
  rsi: number;
  atr: number;
  vix: number;
  yield_10y: number;
  yield_change: number;
  dxy_return: number;
  spread_points: number;
  slippage_points: number;
  total_cost_points: number;
  bull_htf_count: number;
  bear_htf_count: number;
  plus_di: number;
  minus_di: number;
  model_votes: { xgb: number; lgb: number; cat: number };
  regime: {
    regime: "TRENDING" | "RANGING" | "VOLATILE";
    confidence: number;
    adx: number;
    h1_adx: number;
    h4_adx: number;
    strength: string;
    is_trending: boolean;
    is_ranging: boolean;
    is_expansion: boolean;
    expected_behavior: string;
  };
  confluence: {
    bullish_score: number;
    bearish_score: number;
    quality_score: number;
    grade: string;
    direction: "UP" | "DOWN";
    htf_blocked: boolean;
    block_reason?: string;
    spread_penalty: number;
    reasons: string[];
    components: {
      htf_trend_alignment: number;
      regime_strength: number;
      liquidity_sweep: number;
      ml_confidence: number;
      dxy_divergence: number;
      volatility_align: number;
    };
  };
  risk: {
    sl: number;
    tp1: number;
    tp2: number;
    tp3: number;
    rr: number;
    lots: number;
    risk_dollar: number;
    risk_pct: number;
    ev_atr: number;
    positive_ev: boolean;
    spread: { spread_points: number; spread_pct_atr: number; acceptable: boolean };
  };
  structure: {
    fvgs: Array<{ type: string; gap_low: number; gap_high: number; size_atr: number; tf: string }>;
    order_blocks: Array<{ type: string; high: number; low: number; mid: number; tf: string; tested: boolean }>;
    liquidity: { equal_highs: number[]; equal_lows: number[]; recent_stop_hunt_up: boolean; recent_stop_hunt_down: boolean };
  };
  snapshot: {
    current_price: number;
    server_time: string;
    regime: string;
    nearest_support: number;
    nearest_resistance: number;
    [key: string]: unknown;
  };
  saved_at: string;
  createdAt?: string;
}

// ─── Blog ────────────────────────────────────────────────────────────────────
export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: { _id: string; name: string; avatar?: string };
  category: string;
  tags: string[];
  status: "draft" | "published";
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  user: Omit<IUser, "password">;
  accessToken: string;
  refreshToken: string;
}

// ─── Stats ──────────────────────────────────────────────────────────────────
export interface PredictionStats {
  totalPredictions: number;
  accuracy: number;
  winRate: number;
  avgConfidence: number;
  totalTrades: number;
  skippedTrades: number;
  bullSignals: number;
  bearSignals: number;
  avgRR: number;
}
