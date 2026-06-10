'use client';
import { TbBook2 } from 'react-icons/tb';

const glossaryTerms = [
  { term: "ADX",            full: "Average Directional Index",     definition: "Measures trend strength. 0–25: ranging/weak, 25–50: trending, >50: strong trend. Filters low-momentum markets." },
  { term: "ATR",            full: "Average True Range",            definition: "Volatility measure in dollars. Used for stop loss placement, position sizing, and regime detection." },
  { term: "RSI",            full: "Relative Strength Index",       definition: "Momentum oscillator 0–100. >70 overbought, <30 oversold. Divergences signal reversals." },
  { term: "+DI / -DI",      full: "Directional Indicators",        definition: "+DI above -DI = bullish bias. Core inputs to ADX calculation." },
  { term: "Hurst Exp.",     full: "Trend Persistence Metric",      definition: ">0.55 = trending market. <0.45 = mean-reverting. The fractal signature of a price series." },
  { term: "Vol %ile",       full: "Volatility Percentile",         definition: "Current ATR rank vs last 100 bars. >0.7 = expanding volatility. <0.3 = compression zone." },
  { term: "FVG",            full: "Fair Value Gap",                definition: "3-candle imbalance area where price moved impulsively. Acts as support/resistance or reversion magnet." },
  { term: "OB",             full: "Order Block",                   definition: "Last opposing candle before a strong impulse move. Institutional resting orders." },
  { term: "BOS",            full: "Break of Structure",            definition: "Price breaks previous swing high/low — confirms trend continuation." },
  { term: "CHoCH",          full: "Change of Character",           definition: "First break of opposite swing. Potential trend reversal signal. Precedes a full BOS." },
  { term: "HTF Alignment",  full: "Higher Timeframe Alignment",    definition: "How many timeframes (M5, M15, H1, H4) agree on directional bias. 3–4 = strong conviction." },
  { term: "Grade",          full: "Confluence Signal Grade",       definition: "Overall quality score A+ to D. Combines HTF alignment, regime, ML confidence, structure, macro." },
  { term: "Eff. Conf.",     full: "Effective Confidence",          definition: "ML confidence minus spread+slippage cost penalty. Realistic edge after trading costs." },
  { term: "EV",             full: "Expected Value (in ATR)",       definition: "Reward × TP_prob − Risk × SL_prob. Positive = edge. ATR units allow cross-market comparison." },
  { term: "R:R",            full: "Risk/Reward Ratio",             definition: "TP distance ÷ SL distance. Typically 1.5–2.5R. Higher R:R allows profitable trading at lower win rates." },
  { term: "DXY",            full: "US Dollar Index",               definition: "1-day change. DXY up = bearish for gold (inverse correlation). DXY down = tailwind for gold prices." },
  { term: "VIX",            full: "CBOE Volatility Index",         definition: ">25 = fear/safe-haven demand for gold. <12 = risk-on complacency. Gold often rallies during VIX spikes." },
  { term: "Displacement",   full: "Impulsive Candle Signal",       definition: "Candle body >2× ATR. Indicates strong institutional momentum and potential breakout confirmation." },
  { term: "Regime",         full: "Market Regime",                 definition: "Current market state: TRENDING_BULL, TRENDING_BEAR, RANGING, EXPANSION, NEWS_DRIVEN." },
  { term: "Spread Penalty", full: "Spread Quality Deduction",      definition: "Score deduction based on current bid-ask spread. Wider spread = lower effective signal quality." },
];

const ACCENT_COLORS = [
  'var(--cyan)',
  'var(--bull)',
  'var(--amber)',
  'var(--bear)',
  'var(--cyan-bright)',
  'var(--bull-bright)',
];

export default function Glossary() {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-dim)',
      borderRadius: '0.75rem',
      padding: '1.75rem',
      margin: '0 0 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-faint)', position: 'relative' }}>
        <TbBook2 size={18} style={{ color: 'var(--cyan)' }} />
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Glossary
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: '0.15rem' }}>
            Every term used in the prediction engine
          </p>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: 'var(--border-subtle)', letterSpacing: '-0.04em' }}>
          {glossaryTerms.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.6rem', position: 'relative' }}>
        {glossaryTerms.map((item, idx) => {
          const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          return (
            <div
              key={idx}
              style={{
                padding: '0.875rem 1rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-faint)',
                borderLeft: `2px solid ${accent}`,
                borderRadius: '0.5rem',
                transition: 'transform var(--t-med) var(--ease-std), border-color var(--t-med) var(--ease-std), background var(--t-med) var(--ease-std)',
                cursor: 'default',
                animation: `fadeUp 0.35s ${idx * 0.012}s var(--ease) both`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-2px)';
                el.style.background = 'var(--bg-overlay)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'none';
                el.style.background = 'var(--bg-surface)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: accent, letterSpacing: '0.02em' }}>
                  {item.term}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: 'var(--text-muted)', maxWidth: '120px', textAlign: 'right', lineHeight: 1.35 }}>
                  {item.full}
                </div>
              </div>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {item.definition}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-faint)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
        XAUUSD APEX TERMINAL · PREDICTION ENGINE REFERENCE
      </div>
    </div>
  );
}
