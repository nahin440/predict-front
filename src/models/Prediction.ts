import mongoose, { Schema, Model } from "mongoose";

// Mirrors bot_m15/predictor.py's predict_now() return dict field-for-field
// (v16, single-bot — H1/H4 retired as standalone bots, now feed in as
// context features only). strict:false means Mongo will still accept any
// field not listed here — this schema exists for documentation/validation,
// not as a strict allowlist.
const PredictionSchema = new Schema(
  {
    bot_name: String, bot_label: String,
    primary_tf: String, context_tf: String,
    server_time: String,
    timestamp: { type: Date },
    target_time: Date,
    saved_at: { type: Date, default: Date.now },
    horizon: Number,
    current_price: { type: Number, required: true },
    direction: { type: String, enum: ["UP", "DOWN"], required: true },
    weak_direction: String,
    allowed_direction: String,
    signal_strength: String,
    grade: String,
    confidence: Number,
    effective_confidence: Number,
    macro_adjusted_conf: Number,
    raw_prob_up: Number,
    prob_up: Number,
    is_genuinely_uncertain: Boolean,
    calibrated_dist_from_half: Number,
    was_calibrated: Boolean,
    should_skip: { type: Boolean, default: false },
    skip_reason: String,
    skip_priority: mongoose.Schema.Types.Mixed,
    skip_guard_active: Boolean,
    all_hard_blocks: [String],
    all_soft_failures: [String],
    pattern_bias: String,
    pattern_confluence: Number,
    wave_pattern: String,
    wave_direction: String,
    wave_count: Number,
    // Technical indicators
    adx: Number, plus_di: Number, minus_di: Number,
    rsi: Number, atr: Number, atr_percentile: Number,
    vix: Number, yield_10y: Number, yield_change: Number, yield_spread: Number,
    dxy_return: Number, macro_adj: Number, macro_reason: String,
    spread_points: Number, slippage_points: Number, total_cost_points: Number,
    spread_atr_ratio: Number, spread_deduction: Number,
    min_conf_required: Number,
    // HTF / trend alignment
    bull_htf_count: Number, bear_htf_count: Number,
    htf_ok: Boolean, tf_trend_score: Number, tf_agreement: Number,
    // Boolean flags
    rr_ok: Boolean, ev_ok: Boolean,
    exec_quality_ok: Boolean, exec_model_used: Boolean,
    at_resistance: Boolean, at_support: Boolean, is_stable: Boolean,
    has_divergence: Boolean, has_reversal_pattern: Boolean, has_wyckoff: Boolean,
    spread_is_extreme: Boolean, spread_is_wide: Boolean,
    sr_at_level: Boolean, sr_conflict: Boolean,
    // Scores
    exec_quality_score: Number, sr_position_score: Number, stability_score: Number,
    // Session
    session_name: String, session_quality: String,
    // Data objects (flexible schema — see bot_m15/risk/risk_engine.py,
    // analysis/structure_engine.py, analysis/confluence_engine.py,
    // analysis/regime_engine.py for exact nested shapes)
    model_votes: Schema.Types.Mixed,
    regime: Schema.Types.Mixed,
    regime_name: String,
    confluence: Schema.Types.Mixed,
    // risk: { sl, tp1, tp2, tp3, invalidation, tp_prob, sl_prob, rr,
    //   rr_meets_minimum, lots, risk_dollar, risk_pct, ev_atr, ev_pct,
    //   positive_ev, ev_meets_minimum, spread, trailing, drawdown }
    risk: Schema.Types.Mixed,
    structure: Schema.Types.Mixed,
    snapshot: Schema.Types.Mixed,
    fibonacci: Schema.Types.Mixed,
    fib_trend_direction: String,
    explanation: Schema.Types.Mixed,
    active_patterns: [String],
    pattern_details: [Schema.Types.Mixed],
    // Outcome tracking (set by admin/analytics, never by the bot itself)
    outcome: { type: String, enum: ["WIN", "LOSS", "PENDING", "CANCELLED"], default: "PENDING" },
    outcome_price: Number,
  },
  { timestamps: true, strict: false }
);

PredictionSchema.index({ timestamp: -1 });
PredictionSchema.index({ direction: 1, should_skip: 1 });
PredictionSchema.index({ confidence: -1 });
PredictionSchema.index({ saved_at: -1 });

const Prediction: Model<mongoose.Document> =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema, "predictions_m15");

export default Prediction;
