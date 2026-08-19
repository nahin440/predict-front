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
// Mirrors bot_m15/predictor.py's predict_now() return dict, and the
// analysis-engine sub-shapes it embeds (risk_engine.py's assess(),
// structure_engine.py's analyze(), regime_engine.py's classify(),
// confluence_engine.py's score()) — all confirmed field-for-field against
// the bot source. Optional fields exist because the schema is intentionally
// permissive (see models/Prediction.ts's strict:false) — a field can be
// absent on older documents saved by a previous bot version.
export interface IPrediction {
  _id: string;
  bot_name?: string;
  bot_label?: string;
  primary_tf?: string;
  context_tf?: string;
  server_time: string;
  timestamp: string;
  target_time: string;
  current_price: number;
  direction: "UP" | "DOWN";
  weak_direction?: string;
  signal_strength?: string;
  grade?: string;
  confidence: number;
  effective_confidence: number;
  macro_adjusted_conf?: number;
  prob_up: number;
  raw_prob_up?: number;
  is_genuinely_uncertain?: boolean;
  calibrated_dist_from_half?: number;
  was_calibrated?: boolean;
  should_skip: boolean;
  skip_reason?: string;
  skip_priority?: number | string | null;
  skip_guard_active?: boolean;
  all_hard_blocks?: string[];
  all_soft_failures?: string[];
  horizon: number;
  allowed_direction?: string;
  min_conf_required?: number;
  adx: number;
  plus_di?: number;
  minus_di?: number;
  rsi: number;
  atr: number;
  atr_percentile?: number;
  vix: number;
  yield_10y: number;
  yield_change: number;
  yield_spread?: number;
  dxy_return: number;
  macro_adj?: number;
  macro_reason?: string;
  spread_points: number;
  slippage_points: number;
  total_cost_points: number;
  spread_atr_ratio?: number;
  spread_deduction?: number;
  spread_is_wide?: boolean;
  spread_is_extreme?: boolean;
  bull_htf_count: number;
  bear_htf_count: number;
  htf_ok?: boolean;
  tf_trend_score?: number;
  tf_agreement?: number;
  rr_ok?: boolean;
  ev_ok?: boolean;
  is_stable?: boolean;
  stability_score?: number;
  sr_conflict?: boolean;
  sr_at_level?: boolean;
  sr_position_score?: number;
  at_resistance?: boolean;
  at_support?: boolean;
  session_name: string;
  session_quality?: string;
  exec_quality_score?: number;
  exec_model_used?: boolean;
  exec_quality_ok?: boolean;
  pattern_bias?: string;
  pattern_confluence?: number;
  active_patterns?: string[];
  has_divergence?: boolean;
  has_wyckoff?: boolean;
  has_reversal_pattern?: boolean;
  fib_trend_direction?: string;
  wave_pattern?: string;
  wave_direction?: string;
  wave_count?: number;
  model_votes: Record<string, number>;
  regime_name?: string;
  regime: {
    regime: "TRENDING" | "RANGING" | "VOLATILE" | "EXPANSION" | "UNKNOWN" | string;
    confidence: number;
    adx: number;
    plus_di: number;
    minus_di: number;
    atr: number;
    atr_rank?: number;
    hurst: number;
    trend_persist?: number;
    vol_pct?: number;
    var_ratio?: number;
    vol_state: string;
    is_trending: boolean;
    is_ranging: boolean;
    is_news_driven: boolean;
    is_expansion?: boolean;
  };
  confluence: {
    grade: string;
    direction?: "UP" | "DOWN";
    bullish_score: number;
    bearish_score: number;
    bull_htf_count?: number;
    bear_htf_count?: number;
    at_resistance?: boolean;
    at_support?: boolean;
    sr_conflict?: boolean;
    sr_at_level?: boolean;
    sr_position_score?: number;
    reasons: string[];
    components: Record<string, number>;
  };
  risk: {
    sl: number;
    tp1: number;
    tp2: number;
    tp3: number;
    invalidation?: number;
    tp_prob?: number;
    sl_prob?: number;
    rr: number;
    rr_meets_minimum?: boolean;
    lots: number;
    risk_dollar: number;
    risk_pct: number;
    ev_atr: number;
    ev_pct?: number;
    positive_ev: boolean;
    ev_meets_minimum?: boolean;
    spread: { spread_points: number; spread_pct_atr: number; acceptable: boolean; warning?: string | null };
    trailing?: { activation_distance: number; trail_step: number };
    drawdown?: { drawdown_sequence_prob: number };
  };
  structure: {
    nearest_support: number;
    nearest_resistance: number;
    support_distance_atr?: number;
    resistance_distance_atr?: number;
    structure_bias_score?: number;
    m5_bos_type?: string;
    m5_bos_level?: number;
    m5_choch_type?: string;
    m5_choch_level?: number;
    h1_bos_type?: string;
    h1_bos_level?: number;
    displacement?: boolean;
    fvg_type?: string;
    fvg_low?: number;
    fvg_high?: number;
    fvg_distance_atr?: number;
    fvg_bull_count?: number;
    fvg_bear_count?: number;
    ob_type?: string;
    ob_level?: number;
    ob_distance_atr?: number;
    liquidity_pressure_score?: number;
    distance_to_liquidity_atr?: number;
    recent_stop_hunt_up?: boolean;
    recent_stop_hunt_down?: boolean;
  };
  pattern_details?: Array<{ name: string; direction?: "BULL" | "BEAR" | string; strength: number }>;
  fibonacci?: {
    fib_0382?: number; fib_0500?: number; fib_0618?: number; fib_0786?: number;
    fib_1272?: number; fib_1618?: number;
    swing_hi?: number; swing_lo?: number;
    [key: string]: unknown;
  };
  snapshot: {
    current_price: number;
    server_time: string;
    [key: string]: unknown;
  };
  explanation?: Record<string, unknown>;
  outcome?: "WIN" | "LOSS" | "PENDING" | "CANCELLED";
  outcome_price?: number;
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
