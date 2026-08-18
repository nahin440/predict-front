import mongoose, { Schema, Model } from "mongoose";

const PredictionSchema = new Schema(
  {
    server_time: String,
    timestamp: { type: Date },
    target_time: Date,
    saved_at: { type: Date, default: Date.now },
    current_price: { type: Number, required: true },
    direction: { type: String, enum: ["UP", "DOWN"], required: true },
    allowed_direction: String,
    confidence: Number,
    effective_confidence: Number,
    macro_adjusted_conf: Number,
    raw_prob_up: Number,
    prob_up: Number,
    should_skip: { type: Boolean, default: false },
    skip_reason: String,
    skip_priority: mongoose.Schema.Types.Mixed,
    signal_strength: String,
    weak_direction: String,
    wave_pattern: String,
    pattern_bias: String,
    pattern_confluence: Number,
    horizon: Number,
    // Technical indicators
    adx: Number, rsi: Number, atr: Number, atr_percentile: Number,
    vix: Number, yield_10y: Number, yield_change: Number, yield_spread: Number,
    dxy_return: Number, spread_points: Number, slippage_points: Number,
    total_cost_points: Number, spread_atr_ratio: Number, spread_deduction: Number,
    bull_htf_count: Number, bear_htf_count: Number,
    plus_di: Number, minus_di: Number,
    // Boolean flags
    htf_ok: Boolean, rr_ok: Boolean, ev_ok: Boolean,
    exec_quality_ok: Boolean, exec_model_used: Boolean,
    at_resistance: Boolean, at_support: Boolean, is_stable: Boolean,
    has_divergence: Boolean, has_reversal_pattern: Boolean, has_wyckoff: Boolean,
    spread_is_extreme: Boolean, spread_is_wide: Boolean,
    sr_at_level: Boolean, sr_conflict: Boolean,
    // Scores
    exec_quality_score: Number, sr_position_score: Number, stability_score: Number,
    macro_adj: Number, min_conf_required: Number,
    // Session
    session_name: String, session_quality: String,
    // Data objects (flexible schema)
    model_votes: Schema.Types.Mixed,
    regime: Schema.Types.Mixed,
    confluence: Schema.Types.Mixed,
    risk: Schema.Types.Mixed,
    structure: Schema.Types.Mixed,
    snapshot: Schema.Types.Mixed,
    fibonacci: Schema.Types.Mixed,
    explanation: Schema.Types.Mixed,
    active_patterns: [String],
    pattern_details: [Schema.Types.Mixed],
    all_hard_blocks: [String],
    all_soft_failures: [String],
    // Outcome tracking
    outcome: { type: String, enum: ["WIN", "LOSS", "PENDING", "CANCELLED"], default: "PENDING" },
    outcome_price: Number,
    // Regime name string (redundant but kept for compatibility)
    regime_name: String,
    grade: String,
    macro_reason: String,
  },
  { timestamps: true, strict: false }
);

PredictionSchema.index({ timestamp: -1 });
PredictionSchema.index({ direction: 1, should_skip: 1 });
PredictionSchema.index({ confidence: -1 });
PredictionSchema.index({ saved_at: -1 });

// ─── Multi-timeframe support ───────────────────────────────────────────────
// The bot backend now runs three independent bots (M15 / H1 / H4), each
// writing into its own MongoDB collection within the same "xau_dashboard"
// database: predictions_m15, predictions_h1, predictions_h4.
// getPredictionModel(tf) returns a Mongoose model bound to the right
// collection, caching each one on mongoose.models so we never redefine the
// same model twice (which mongoose/Next.js hot-reload would otherwise throw
// on).
export type Timeframe = "m15" | "h1" | "h4";

export const TIMEFRAMES: Timeframe[] = ["m15", "h1", "h4"];

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  m15: "M15",
  h1: "H1",
  h4: "H4",
};

const COLLECTION_BY_TF: Record<Timeframe, string> = {
  m15: "predictions_m15",
  h1: "predictions_h1",
  h4: "predictions_h4",
};

export function isTimeframe(value: string | null | undefined): value is Timeframe {
  return !!value && (TIMEFRAMES as string[]).includes(value);
}

export function getPredictionModel(tf: Timeframe): Model<mongoose.Document> {
  const modelName = `Prediction_${tf}`;
  const collectionName = COLLECTION_BY_TF[tf];
  return (
    (mongoose.models[modelName] as Model<mongoose.Document>) ||
    mongoose.model(modelName, PredictionSchema, collectionName)
  );
}

// Back-compat default export — kept pointed at the M15 collection (the
// original single-bot collection name before the multi-timeframe split)
// so any code that hasn't been migrated yet still works.
const Prediction: Model<mongoose.Document> = getPredictionModel("m15");

export default Prediction;
