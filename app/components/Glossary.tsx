'use client';

const glossaryTerms = [
  { term: "ADX", full: "Average Directional Index", definition: "Measures trend strength. 0–25: ranging/weak, 25–50: trending, >50: strong trend. Filters low-momentum markets." },
  { term: "ATR", full: "Average True Range", definition: "Volatility measure in dollars. Used for stop loss placement, position sizing, and regime detection." },
  { term: "RSI", full: "Relative Strength Index", definition: "Momentum oscillator 0–100. >70 overbought, <30 oversold. Divergences signal reversals." },
  { term: "+DI / −DI", full: "Directional Indicators", definition: "+DI above −DI = bullish bias. Inputs to ADX calculation." },
  { term: "Hurst Exponent", full: "Trend Persistence Metric", definition: ">0.55 = trending market. <0.45 = mean-reverting (ranging). The fractal signature of a price series." },
  { term: "Vol Percentile", full: "Volatility Percentile", definition: "Current ATR rank vs last 100 bars. >0.7 = expanding volatility. <0.3 = compression zone." },
  { term: "FVG", full: "Fair Value Gap", definition: "3-candle imbalance area where price moved impulsively. Acts as support/resistance or a reversion magnet." },
  { term: "OB", full: "Order Block", definition: "Last opposing candle before a strong impulse move. Institutional resting orders — price tends to respect these zones." },
  { term: "BOS", full: "Break of Structure", definition: "Price breaks previous swing high/low — confirms trend continuation. Bullish BOS = higher high, Bearish BOS = lower low." },
  { term: "CHoCH", full: "Change of Character", definition: "First break of opposite swing. Potential trend reversal signal. Precedes a full BOS in most cases." },
  { term: "HTF Alignment", full: "Higher Timeframe Alignment", definition: "How many timeframes (M5, M15, H1, H4) agree on directional bias. 3–4 alignment = strong conviction." },
  { term: "Grade", full: "Confluence Signal Grade", definition: "Overall quality score A+ to D. Combines HTF alignment, regime, ML confidence, structure, macro, vol, session." },
  { term: "Effective Conf.", full: "Effective Confidence", definition: "ML confidence minus spread+slippage cost penalty. The realistic edge after trading costs are removed." },
  { term: "EV", full: "Expected Value (in ATR)", definition: "Reward × TP_prob − Risk × SL_prob. Positive = edge. ATR units allow cross-market comparability." },
  { term: "R:R", full: "Risk/Reward Ratio", definition: "TP distance ÷ SL distance. Typically 1.5–2.5R. Higher R:R allows profitable trading even at lower win rates." },
  { term: "DXY", full: "US Dollar Index", definition: "1-day change. DXY ↑ = bearish for gold (inverse correlation). DXY ↓ = tailwind for gold prices." },
  { term: "VIX", full: "CBOE Volatility Index", definition: ">25 = fear/safe-haven demand for gold. <12 = risk-on complacency. Gold often rallies during VIX spikes." },
  { term: "Displacement", full: "Impulsive Candle Signal", definition: "Candle body >2× ATR. Indicates strong institutional momentum and potential breakout confirmation." },
  { term: "Regime", full: "Market Regime", definition: "Current market state: TRENDING_BULL, TRENDING_BEAR, RANGING, EXPANSION, NEWS_DRIVEN. Determines which strategies apply." },
  { term: "Spread Penalty", full: "Spread Quality Deduction", definition: "Score deduction based on current bid-ask spread. Wider spread = lower effective signal quality rating." },
];

const CATEGORY_COLORS = [
  'var(--gold)', 'var(--green)', 'var(--blue)', 'var(--purple)',
  'var(--cyan)', 'var(--red)', 'var(--gold)', 'var(--green)',
];

export default function Glossary() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-dim)',
      borderRadius: '1rem',
      padding: '1.75rem',
      margin: '1.5rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-60px', right: '-60px',
        width: '200px', height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-dim)',
      }}>
        <span style={{ fontSize: '1.5rem' }}>📖</span>
        <div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--gold)',
            letterSpacing: '-0.01em',
          }}>
            Complete Glossary
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
            marginTop: '0.2rem',
          }}>
            EVERY TERM USED IN THE PREDICTION ENGINE — EXPLAINED
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--text-dim)',
        }}>
          {glossaryTerms.length}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '0.75rem',
      }}>
        {glossaryTerms.map((item, idx) => {
          const accentColor = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          return (
            <div
              key={idx}
              style={{
                padding: '0.875rem 1rem',
                background: 'var(--bg-glass-light)',
                border: '1px solid var(--border-dim)',
                borderLeft: `3px solid ${accentColor}`,
                borderRadius: '0.65rem',
                transition: 'all 0.25s ease',
                cursor: 'default',
                animation: `fadeSlideUp 0.4s ${idx * 0.02}s ease both`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-3px)';
                el.style.borderColor = `${accentColor}60`;
                el.style.boxShadow = `0 8px 25px rgba(0,0,0,0.2)`;
                el.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'none';
                el.style.borderColor = 'var(--border-dim)';
                el.style.borderLeftColor = accentColor;
                el.style.boxShadow = 'none';
                el.style.background = 'var(--bg-glass-light)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: accentColor,
                }}>
                  {item.term}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.55rem',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  maxWidth: '130px',
                  lineHeight: 1.3,
                }}>
                  {item.full}
                </div>
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                {item.definition}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-dim)',
        textAlign: 'center',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
      }}>
        * THESE TERMS ARE USED THROUGHOUT THE PREDICTION ENGINE AND REAL-TIME ANALYSIS
      </div>
    </div>
  );
}
