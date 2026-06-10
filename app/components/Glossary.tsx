'use client';

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
  'var(--forest)',
  'var(--teal)',
  'var(--rose-dark)',
  'var(--amber)',
  'var(--bull-bright)',
  'var(--teal-bright)',
];

export default function Glossary() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-dim)',
      borderRadius: '0.875rem',
      padding: '1.75rem',
      margin: '1.5rem 0',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(6,66,50,0.06)',
    }}>
      {/* Watermark gear */}
      <div style={{
        position: 'absolute',
        right: '-2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '18rem',
        color: 'var(--border-dim)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: 0.4,
        animation: 'gearSpin 60s linear infinite',
        transformOrigin: 'center',
      }}>
        ⚙
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-dim)',
        position: 'relative',
      }}>
        <span style={{ fontSize: '1.4rem' }}>📖</span>
        <div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.3rem',
            fontWeight: 400,
            color: 'var(--forest)',
            letterSpacing: '0.08em',
          }}>
            Complete Glossary
          </h2>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.58rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            marginTop: '0.2rem',
          }}>
            Every term used in the prediction engine — defined
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--border-accent)',
          letterSpacing: '-0.03em',
        }}>
          {glossaryTerms.length}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
        gap: '0.65rem',
        position: 'relative',
      }}>
        {glossaryTerms.map((item, idx) => {
          const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          return (
            <div
              key={idx}
              style={{
                padding: '0.875rem 1rem',
                background: 'var(--bg-silk)',
                border: '1px solid var(--border-dim)',
                borderLeft: `3px solid ${accent}`,
                borderRadius: '0.6rem',
                transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s, background 0.25s',
                cursor: 'default',
                animation: `fadeSlideUp 0.4s ${idx * 0.016}s var(--ease-out) both`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-3px)';
                el.style.borderColor = `${accent}45`;
                el.style.borderLeftColor = accent;
                el.style.boxShadow = '0 8px 24px rgba(6,66,50,0.08)';
                el.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'none';
                el.style.borderColor = 'var(--border-dim)';
                el.style.borderLeftColor = accent;
                el.style.boxShadow = 'none';
                el.style.background = 'var(--bg-silk)';
              }}
            >
              {/* Subtle watermark */}
              <div style={{
                position: 'absolute',
                right: '0.5rem',
                bottom: '-0.4rem',
                fontSize: '2.2rem',
                fontWeight: 900,
                color: accent,
                opacity: 0.06,
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}>
                {item.term[0]}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.38rem' }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  color: accent,
                  letterSpacing: '0.06em',
                }}>
                  {item.term}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.52rem',
                  color: 'var(--text-muted)',
                  maxWidth: '130px',
                  textAlign: 'right',
                  lineHeight: 1.35,
                }}>
                  {item.full}
                </div>
              </div>

              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
              }}>
                {item.definition}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-dim)',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.58rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.07em',
        position: 'relative',
      }}>
        ⚙ These terms are used throughout the prediction engine ⚙
      </div>
    </div>
  );
}
