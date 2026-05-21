'use client';

import './Glossary.css';

export default function Glossary() {
  const glossaryTerms = [
    { term: "ADX (Average Directional Index)", definition: "Measures trend strength. 0-25: ranging/weak trend, 25-50: trending, >50: strong trend. Used to filter low-momentum markets." },
    { term: "ATR (Average True Range)", definition: "Volatility measure in dollars. Used for stop loss placement, position sizing, and identifying expansion/compression regimes." },
    { term: "RSI (Relative Strength Index)", definition: "Momentum oscillator (0-100). >70 overbought, <30 oversold. Divergences with price signal reversals." },
    { term: "+DI / -DI", definition: "Directional indicators. +DI above -DI = bullish bias. Part of ADX calculation." },
    { term: "Hurst Exponent", definition: "Measures trend persistence. >0.55 = trending, <0.45 = mean-reverting (ranging)." },
    { term: "Volatility Percentile", definition: "Current ATR rank vs last 100 bars. >0.7 = expanding vol, <0.3 = compressing vol." },
    { term: "Trend Persistence", definition: "Percentage of recent bars where price moved consistently in same direction as EMA." },
    { term: "Fair Value Gap (FVG)", definition: "3-candle imbalance area where price left a gap. Often acts as support/resistance or magnet for reversion." },
    { term: "Order Block (OB)", definition: "Last opposing candle before a strong impulsive move. Institutional resting orders – price respects these zones." },
    { term: "BOS (Break of Structure)", definition: "Price breaks previous swing high/low – signals trend continuation." },
    { term: "CHoCH (Change of Character)", definition: "First break of opposite swing – potential trend reversal signal." },
    { term: "Liquidity Sweep", definition: "Price spikes beyond a swing high/low and closes back inside – indicates stop hunt and potential reversal." },
    { term: "Equal Highs/Lows", definition: "Multiple swing highs/lows at similar price – liquidity pools where stops accumulate." },
    { term: "HTF Alignment", definition: "How many timeframes (M5, M15, H1, H4) agree on bullish or bearish bias. 3-4 alignment = strong directional conviction." },
    { term: "Confluence Grade", definition: "Overall signal quality (A+ to D). Combines HTF, regime, ML, structure, macro, volatility, session." },
    { term: "Effective Confidence", definition: "ML confidence minus spread+slippage penalty. Realistic edge after trading costs." },
    { term: "ML Model Votes", definition: "XGBoost, LightGBM, CatBoost individual probabilities. High agreement increases reliability." },
    { term: "Regime", definition: "Market state: TRENDING_BULL, TRENDING_BEAR, RANGING, EXPANSION, NEWS_DRIVEN. Determines strategy." },
    { term: "EV (Expected Value) in ATR", definition: "Reward × TP_prob − Risk × SL_prob. Positive EV = edge. Measured in ATR units for cross-market comparability." },
    { term: "R:R (Risk/Reward)", definition: "TP1 distance divided by SL distance. Typically 1.5R to 2.5R. Higher R:R allows lower win rate." },
    { term: "Spread Penalty", definition: "Deduction from confluence score based on current spread. Wider spread = lower effective quality." },
    { term: "DXY Return", definition: "US Dollar Index 1-day change. DXY↑ typically bearish for gold, DXY↓ bullish." },
    { term: "US10Y / Yield Spread", definition: "10-year Treasury yield and 10-2 spread. Rising yields = headwind for gold. Inverted spread = recession signal." },
    { term: "VIX", definition: "Volatility index. >25 = fear, safe-haven demand for gold. <12 = risk-on, gold may underperform." },
    { term: "Displacement", definition: "Impulsive candle with body >2× ATR – indicates momentum and potential breakout." },
    { term: "H1 / H4 / M15 / M5", definition: "Timeframes: M5 (primary prediction), M15 (intermediate context), H1 (structural), H4 (macro trend)." }
  ];

  return (
    <div className="glossary-container">
      <h2 className="glossary-title">📖 Complete Glossary – Every Term Explained</h2>
      <div className="glossary-grid">
        {glossaryTerms.map((item, idx) => (
          <div key={idx} className="glossary-card">
            <div className="glossary-term">{item.term}</div>
            <div className="glossary-definition">{item.definition}</div>
          </div>
        ))}
      </div>
      <div className="glossary-footer">
        *These terms are used throughout the prediction engine and real-time analysis.
      </div>
    </div>
  );
}