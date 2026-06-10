'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import TradeChecklist from './components/TradeChecklist';
import TradePlanCard from './components/TradePlanCard';
import StructureDetails from './components/StructureDetails';
import RiskDetails from './components/RiskDetails';
import ConfluenceDetails from './components/ConfluenceDetails';
import RegimeDetails from './components/RegimeDetails';
import TechnicalSnapshot from './components/TechnicalSnapshot';
import MacroDetails from './components/MacroDetails';
import FullPredictionModal from './components/FullPredictionModal';
import Glossary from './components/Glossary';

const TICKER_ITEMS = [
  { label: 'XAU/USD', val: '—' },
  { label: 'SIGNAL',  val: '—' },
  { label: 'GRADE',   val: '—' },
  { label: 'ADX',     val: '—' },
  { label: 'RSI',     val: '—' },
  { label: 'ATR',     val: '—' },
  { label: 'DXY',     val: '—' },
  { label: 'VIX',     val: '—' },
  { label: 'SESSION', val: '—' },
];

// Inline SVG gear component
function GearIcon({
  size = 20,
  speed = 12,
  reverse = false,
  color = 'rgba(86,143,135,0.45)',
}: {
  size?: number;
  speed?: number;
  reverse?: boolean;
  color?: string;
}) {
  const teeth = 10;
  const r1 = size * 0.36;
  const r2 = size * 0.47;
  const step = (Math.PI * 2) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step - step * 0.4;
    const a1 = i * step - step * 0.15;
    const a2 = i * step + step * 0.15;
    const a3 = i * step + step * 0.4;
    const cx = size / 2, cy = size / 2;
    if (i === 0) d += `M${(cx + r1 * Math.cos(a0)).toFixed(2)},${(cy + r1 * Math.sin(a0)).toFixed(2)}`;
    else d += `L${(cx + r1 * Math.cos(a0)).toFixed(2)},${(cy + r1 * Math.sin(a0)).toFixed(2)}`;
    d += `L${(cx + r2 * Math.cos(a1)).toFixed(2)},${(cy + r2 * Math.sin(a1)).toFixed(2)}`;
    d += `L${(cx + r2 * Math.cos(a2)).toFixed(2)},${(cy + r2 * Math.sin(a2)).toFixed(2)}`;
    d += `L${(cx + r1 * Math.cos(a3)).toFixed(2)},${(cy + r1 * Math.sin(a3)).toFixed(2)}`;
  }
  d += 'Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', flexShrink: 0 }}>
      <g style={{
        transformOrigin: `${size / 2}px ${size / 2}px`,
        animation: `${reverse ? 'gearSpinReverse' : 'gearSpin'} ${speed}s linear infinite`,
      }}>
        <path d={d} fill={color} stroke={color} strokeWidth="0.6" />
        <circle cx={size / 2} cy={size / 2} r={r1 * 0.65} fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx={size / 2} cy={size / 2} r={size * 0.07} fill={color} />
      </g>
    </svg>
  );
}

export default function Home() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const ts = Date.now();
      const [latestRes, historyRes] = await Promise.all([
        fetch(`/api/predictions/latest?t=${ts}`),
        fetch(`/api/predictions?limit=50&t=${ts}`),
      ]);
      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      if (latestData.prediction) setLatest(latestData.prediction);
      setPredictions(historyData.predictions || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const getCombinedSignal = (pred: any) => {
    // Use signal_strength directly from MongoDB — matches terminal output exactly.
    if (pred.signal_strength && pred.signal_strength !== 'NO TRADE') return pred.signal_strength;
    const dir = pred.direction;
    if (dir !== 'UP' && dir !== 'DOWN') return 'NO SIGNAL';
    return `WEAK ${dir === 'UP' ? 'LONG' : 'SHORT'}`;
  };

  // Format ISO target_time to match terminal format
  const formatTargetTime = (t: string) => {
    if (!t) return '—';
    try { return new Date(t).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'; }
    catch { return t; }
  };

  const getSignalColor = (s: string) => {
    if (s.includes('LONG'))  return 'var(--forest)';
    if (s.includes('SHORT')) return 'var(--bear)';
    return 'var(--text-muted)';
  };

  const tickerData = latest ? [
    { label: 'XAU/USD',  val: `$${latest.current_price?.toFixed(2)}`,        positive: null },
    { label: 'SIGNAL',   val: getCombinedSignal(latest),                       positive: getCombinedSignal(latest).includes('LONG') },
    { label: 'GRADE',    val: latest.grade || '?',                             positive: null },
    { label: 'ADX',      val: latest.adx?.toFixed(1),                          positive: null },
    { label: 'RSI',      val: latest.rsi?.toFixed(1),                          positive: null },
    { label: 'ATR',      val: `$${latest.atr?.toFixed(2)}`,                   positive: null },
    { label: 'DXY 1D',   val: `${latest.dxy_return?.toFixed(2)}%`,            positive: latest.dxy_return < 0 },
    { label: 'VIX',      val: latest.vix?.toFixed(1) || 'N/A',                positive: null },
    { label: 'SESSION',  val: latest.session_name || '—',                      positive: null },
    { label: 'REGIME',   val: latest.regime_name || '—',                       positive: null },
    { label: 'SKIP',     val: latest.should_skip ? 'SKIP' : 'TRADE',          positive: !latest.should_skip },
    { label: 'EFF.CONF', val: `${latest.effective_confidence}%`,               positive: null },
  ] : TICKER_ITEMS;

  if (loading) {
    return (
      <div className="loading">
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" style={{ width: 80, height: 80 }} />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GearIcon size={36} speed={8} color="rgba(86,143,135,0.6)" />
          </div>
        </div>
        <div className="loading-text">INITIALISING TERMINAL</div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const isValidTrade = latest && latest.direction !== 'N/A' && latest.risk?.sl > 0;
  const combinedSignal = latest ? getCombinedSignal(latest) : '';

  const pillStyle = (color = 'var(--teal)'): React.CSSProperties => ({
    padding: '0.2rem 0.75rem',
    background: `${color}12`,
    border: `1px solid ${color}40`,
    borderRadius: '999px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color,
    letterSpacing: '0.04em',
  });

  const dataItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.38rem 0.6rem',
    background: 'var(--bg-silk)',
    border: '1px solid var(--border-dim)',
    borderRadius: '0.35rem',
    gap: '0.5rem',
  };

  return (
    <div className="container">

      {/* ── Header ── */}
      <div className="header">
        <div className="header-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GearIcon size={28} speed={18} color="rgba(86,143,135,0.55)" />
            <h1>XAUUSD PREDICTOR</h1>
            <GearIcon size={18} speed={11} reverse color="rgba(245,186,187,0.5)" />
          </div>
          <div className="header-subtitle">Celestial Terminal · Mechanical Watch System</div>
          <p>Real-time 15-min horizon · Updates every 30s · MongoDB Atlas</p>
        </div>

        <div className="header-right">
          <span className="live-badge">⬤ LIVE</span>

          <div className="last-updated">
            <div className="last-updated-label">Last Updated</div>
            <div className="last-updated-time">{lastUpdated.toLocaleTimeString()}</div>
          </div>

          <button
            className={`refresh-btn${isRefreshing ? ' spinning' : ''}`}
            onClick={fetchData}
          >
            <span className="refresh-icon" style={{ display: 'inline-block', fontSize: '0.85rem' }}>⚙</span>
            Refresh
          </button>

          <Link href="/btc">
            <button className="switch-btn">BTC →</button>
          </Link>
        </div>
      </div>

      {/* ── Ticker Tape ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...tickerData, ...tickerData].map((item: any, i) => (
            <div key={i} className="ticker-item">
              <span className="ticker-label">{item.label}</span>
              <span
                className="ticker-val"
                style={{
                  color: item.positive === true
                    ? 'rgba(6,66,50,0.9)'
                    : item.positive === false
                    ? 'rgba(176,64,64,0.9)'
                    : 'var(--cream)',
                }}
              >
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Latest Prediction ── */}
      {latest && (
        <>
          {/* Oracle Card */}
          <div className="card card-active">

            {/* Decorative gear trio */}
            <div style={{
              position: 'absolute', top: '1rem', right: '3.5rem',
              display: 'flex', gap: '0.3rem', opacity: 0.5, pointerEvents: 'none',
            }}>
              <GearIcon size={18} speed={14} color="rgba(86,143,135,0.55)" />
              <GearIcon size={12} speed={9} reverse color="rgba(245,186,187,0.5)" />
              <GearIcon size={16} speed={20} color="rgba(6,66,50,0.45)" />
            </div>

            <div className="card-header">
              <div>
                <div className="time">
                  {latest.server_time} → {formatTargetTime(latest.target_time)}
                </div>
                <div className="direction-price">
                  <span className="direction" style={{ color: getSignalColor(combinedSignal) }}>
                    {combinedSignal}
                  </span>
                  <span className="price">
                    ${latest.current_price?.toFixed(2)}
                  </span>
                </div>

                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {latest.should_skip && (
                    <span style={pillStyle('var(--bear)')}>
                      SKIP — {latest.skip_reason}
                    </span>
                  )}
                  {latest.signal_strength && (
                    <span style={pillStyle('var(--text-muted)')}>
                      {latest.signal_strength}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className={`grade-badge grade-${latest.grade?.replace('+', '-plus') || 'D'}`}>
                  Grade {latest.grade || '?'}
                </div>
                <div className="score">
                  {latest.confluence?.quality_score?.toFixed(1) ?? latest.confidence}%
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.55rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.2rem',
                  letterSpacing: '0.1em',
                }}>
                  QUALITY SCORE
                </div>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="metrics stagger">
              {[
                { label: 'Confidence',     val: `${latest.confidence?.toFixed(1)}%`,             cls: '' },
                { label: 'Eff. Conf',      val: `${latest.effective_confidence?.toFixed(1)}%`,   cls: '' },
                { label: 'P(UP)',          val: `${(latest.prob_up * 100).toFixed(1)}%`,          cls: latest.prob_up > 0.5 ? 'bull' : 'bear' },
                { label: 'Raw Direction',  val: latest.raw_direction,                              cls: latest.raw_direction === 'UP' ? 'bull' : 'bear' },
                { label: 'ADX',            val: latest.adx?.toFixed(1),                           cls: '' },
                { label: 'RSI',            val: latest.rsi?.toFixed(1),                           cls: '' },
                { label: 'ATR',            val: `$${latest.atr?.toFixed(2)}`,                    cls: '' },
                { label: 'Spread',         val: `${latest.spread_points} pts`,                   cls: '' },
                { label: 'Bull TFs',       val: `${latest.bull_htf_count ?? 0}/4`,               cls: 'bull' },
                { label: 'Bear TFs',       val: `${latest.bear_htf_count ?? 0}/4`,               cls: 'bear' },
                { label: 'Regime',         val: latest.regime_name?.replace('TRENDING_', ''),     cls: '' },
                { label: 'Session',        val: latest.session_name || '—',                       cls: '' },
              ].map(({ label, val, cls }, i) => (
                <div key={i} className="metric" style={{ animationDelay: `${i * 0.04 + 0.2}s` }}>
                  <div className="metric-label">{label}</div>
                  <div className={`metric-value ${cls}`}>{val}</div>
                </div>
              ))}
            </div>

            {/* Soft failures */}
            {latest.all_soft_failures && latest.all_soft_failures.length > 0 && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(176,115,64,0.05)',
                border: '1px solid rgba(176,115,64,0.2)',
                borderRadius: '0.5rem',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem',
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.4rem',
                }}>
                  SOFT FAILURES
                </div>
                {latest.all_soft_failures.map((f: string, i: number) => (
                  <div key={i} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.66rem',
                    color: 'var(--amber-bright)',
                    marginTop: '0.12rem',
                  }}>
                    · {f}
                  </div>
                ))}
              </div>
            )}

            {/* Hard blocks */}
            {latest.all_hard_blocks && latest.all_hard_blocks.length > 0 && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(139,58,58,0.06)',
                border: '1px solid rgba(139,58,58,0.25)',
                borderRadius: '0.5rem',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem',
                  color: 'var(--bear)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.35rem',
                }}>
                  HARD BLOCKS
                </div>
                {latest.all_hard_blocks.map((b: string, i: number) => (
                  <div key={i} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.66rem',
                    color: 'var(--bear)',
                    marginTop: '0.12rem',
                  }}>
                    · {b}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="divider-cn">⚙ TRADE ASSESSMENT ⚙</div>

          {isValidTrade && <TradeChecklist prediction={latest} />}
          {isValidTrade && (
            <TradePlanCard
              risk={latest.risk}
              direction={latest.direction}
              currentPrice={latest.current_price}
            />
          )}

          <StructureDetails
            structure={latest.structure}
            atr={latest.atr}
            currentPrice={latest.current_price}
          />

          {/* ── Divider ── */}
          <div className="divider-cn">⚙ MARKET ANALYSIS ⚙</div>

          {/* Multi-TF + Regime */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}>
            <div className="info-box">
              <div className="info-title">
                <GearIcon size={14} speed={10} color="rgba(86,143,135,0.55)" />
                Multi-Timeframe Alignment
              </div>
              <div className="alignment-stats" style={{ marginBottom: '0.75rem' }}>
                <div>Bull TFs: <span className="bullish-text">{latest.bull_htf_count ?? 0}/4</span></div>
                <div>Bear TFs: <span className="bearish-text">{latest.bear_htf_count ?? 0}/4</span></div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  HTF OK:{' '}
                  <span style={{ color: latest.htf_ok ? 'var(--forest)' : 'var(--bear)' }}>
                    {latest.htf_ok ? '✓' : '✗'}
                  </span>
                </div>
              </div>

              {latest.snapshot && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                  {[
                    { tf: 'M5',  val: latest.snapshot.m5_price_vs_ema20,  val2: latest.snapshot.m5_price_vs_ema50 },
                    { tf: 'M15', val: latest.snapshot.m15_price_vs_ema20, val2: latest.snapshot.m15_price_vs_ema50 },
                    { tf: 'H1',  val: latest.snapshot.h1_price_vs_ema20,  val2: latest.snapshot.h1_price_vs_ema50 },
                    { tf: 'H4',  val: latest.snapshot.h4_price_vs_ema20,  val2: latest.snapshot.h4_price_vs_ema50 },
                  ].map(({ tf, val, val2 }) => (
                    <div key={tf} style={{
                      padding: '0.5rem 0.4rem',
                      background: 'var(--bg-silk)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: '0.4rem',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{tf}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: val > 0 ? 'var(--forest)' : 'var(--bear)' }}>
                        {val?.toFixed(2)}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: val2 > 0 ? 'var(--bull-bright)' : 'var(--bear)', opacity: 0.7 }}>
                        {val2?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {latest.snapshot?.h1_adx && (
                <div style={{ marginTop: '0.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                  H1 ADX: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{latest.snapshot.h1_adx?.toFixed(1)}</span>
                  <span style={{ marginLeft: '1rem' }}>
                    Regime: <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{latest.snapshot.regime} ({latest.snapshot.regime_strength})</span>
                  </span>
                </div>
              )}
            </div>

            <RegimeDetails regime={latest.regime} />
          </div>

          <RiskDetails risk={latest.risk} />
          <ConfluenceDetails confluence={latest.confluence} grade={latest.grade} />
          <TechnicalSnapshot snapshot={latest.snapshot} adx={latest.adx} rsi={latest.rsi} atr={latest.atr} />
          <MacroDetails
            dxyReturn={latest.dxy_return}
            yieldChange={latest.yield_change}
            yield10y={latest.yield_10y}
            yieldSpread={latest.yield_spread}
            vix={latest.vix}
            spxReturn={latest.spx_return ?? null}
            oilReturn={latest.oil_return ?? null}
          />

          {/* Supplementary Data */}
          <div className="info-box" style={{ marginBottom: '1.25rem' }}>
            <div className="section-title">
              <GearIcon size={14} speed={16} reverse color="rgba(86,143,135,0.55)" />
              Supplementary Data
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem' }}>
              {[
                { k: 'Stability Reason',   v: latest.stability_reason || '—' },
                { k: 'Is Stable',          v: latest.is_stable ? 'Yes' : 'No' },
                { k: 'Macro Adj',          v: latest.macro_adj?.toFixed(2) ?? '—' },
                { k: 'Macro Reason',       v: latest.macro_reason || '—' },
                { k: 'Macro Adj Conf',     v: `${latest.macro_adjusted_conf?.toFixed(1)}%` },
                { k: 'Min Conf Required',  v: `${latest.min_conf_required}%` },
                { k: 'Spread Deduction',   v: `${latest.spread_deduction}%` },
                { k: 'Spread ATR Ratio',   v: latest.spread_atr_ratio?.toFixed(3) },
                { k: 'Spread Wide',        v: latest.spread_is_wide ? 'Yes' : 'No' },
                { k: 'Spread Extreme',     v: latest.spread_is_extreme ? 'Yes' : 'No' },
                { k: 'Total Cost Pts',     v: `${latest.total_cost_points} pts` },
                { k: 'Slippage Pts',       v: `${latest.slippage_points} pts` },
                { k: 'SR Conflict',        v: latest.sr_conflict ? 'Yes' : 'No' },
                { k: 'SR Position Score',  v: latest.sr_position_score },
                { k: 'At Support',         v: latest.at_support ? 'Yes' : 'No' },
                { k: 'At Resistance',      v: latest.at_resistance ? 'Yes' : 'No' },
                { k: 'Exec Model Used',    v: latest.exec_model_used ? 'Yes' : 'No' },
                { k: 'Exec Quality OK',    v: latest.exec_quality_ok ? 'Yes' : 'No' },
                { k: 'Exec Quality Score', v: latest.exec_quality_score?.toFixed(3) },
                { k: 'Session Quality',    v: latest.session_quality },
                { k: 'Skip Priority',      v: latest.skip_priority },
                { k: 'Allowed Direction',  v: latest.allowed_direction },
                { k: 'RR OK',              v: latest.rr_ok ? 'Yes' : 'No' },
                { k: 'EV OK',              v: latest.ev_ok ? 'Yes' : 'No' },
                { k: 'HTF OK',             v: latest.htf_ok ? 'Yes' : 'No' },
                { k: 'Raw Prob UP',        v: `${(latest.raw_prob_up * 100).toFixed(1)}%` },
                { k: 'Yield 10Y',          v: `${latest.yield_10y?.toFixed(3)}%` },
                { k: 'Yield Spread',       v: `${latest.yield_spread?.toFixed(3)}%` },
                { k: 'ATR Percentile',     v: `${(latest.atr_percentile * 100).toFixed(0)}%` },
              ].map(({ k, v }) => (
                <div key={k} style={dataItemStyle}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

            {latest.model_votes && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                  MODEL VOTES
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.entries(latest.model_votes).map(([model, vote]: [string, any]) => (
                    <div key={model} style={{
                      padding: '0.3rem 0.75rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: '0.4rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.73rem',
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{model.toUpperCase()} </span>
                      <span style={{ fontWeight: 700, color: vote > 0.5 ? 'var(--forest)' : 'var(--bear)' }}>
                        {(vote * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Full JSON */}
          <div style={{ textAlign: 'center', marginTop: '0.75rem', marginBottom: '1.75rem' }}>
            <button
              onClick={() => setSelectedPrediction(latest)}
              style={{
                background: 'var(--bg-silk)',
                border: '1px solid var(--border-accent)',
                padding: '0.6rem 1.75rem',
                borderRadius: '0.5rem',
                color: 'var(--teal)',
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                transition: 'var(--transition-ui)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card-hover)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-glow)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-silk)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-accent)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              }}
            >
              <GearIcon size={13} speed={8} color="rgba(86,143,135,0.7)" />
              VIEW FULL JSON
            </button>
          </div>
        </>
      )}

      {/* ── History Table ── */}
      <div className="divider-cn">⚙ PREDICTION HISTORY ⚙</div>
      <div className="history-table">
        <div className="history-header">
          <GearIcon size={16} speed={15} reverse color="rgba(86,143,135,0.5)" />
          <h2>Prediction History</h2>
          <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255,245,242,0.4)', letterSpacing: '0.1em' }}>
            LAST 50 RECORDS
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Price</th>
                <th>Signal</th>
                <th>Direction</th>
                <th>Confidence</th>
                <th>Eff. Conf</th>
                <th>Grade</th>
                <th>Regime</th>
                <th>ADX</th>
                <th>RSI</th>
                <th>Session</th>
                <th>Skip</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred: any) => {
                const dir = pred.direction;
                const combined = pred.signal_strength && pred.signal_strength !== 'NO TRADE'
                  ? pred.signal_strength
                  : (dir === 'UP' || dir === 'DOWN')
                    ? `WEAK ${dir === 'UP' ? 'LONG' : 'SHORT'}`
                    : 'NO SIGNAL';
                const sigColor = combined.includes('LONG') ? 'var(--forest)' : combined.includes('SHORT') ? 'var(--bear)' : 'var(--text-muted)';
                return (
                  <tr key={pred._id} onClick={() => setSelectedPrediction(pred)}>
                    <td>{pred.server_time?.slice(5, 16)}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: 'var(--text-primary)' }}>
                      ${pred.current_price?.toFixed(2)}
                    </td>
                    <td style={{ fontWeight: 700, color: sigColor, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem' }}>
                      {combined}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: pred.direction === 'UP' ? 'var(--forest)' : 'var(--bear)' }}>
                      {pred.direction === 'UP' ? '▲' : '▼'} {pred.direction}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pred.confidence?.toFixed(0)}%</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--teal)' }}>{pred.effective_confidence?.toFixed(0)}%</td>
                    <td>
                      <span className={`grade-badge grade-${pred.grade?.replace('+', '-plus') || 'D'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.42rem' }}>
                        {pred.grade || '?'}
                      </span>
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'var(--text-muted)' }}>
                      {pred.regime?.regime?.replace('TRENDING_', '') || '?'}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>{pred.adx?.toFixed(1)}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>{pred.rsi?.toFixed(1)}</td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem' }}>{pred.session_name || '—'}</td>
                    <td>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.6rem',
                        color: pred.should_skip ? 'var(--bear)' : 'var(--forest)',
                        fontWeight: 700,
                      }}>
                        {pred.should_skip ? 'SKIP' : '✓ OK'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedPrediction && (
        <FullPredictionModal
          prediction={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
        />
      )}

      {/* ── Divider ── */}
      <div className="divider-cn">⚙ GLOSSARY ⚙</div>
      <Glossary />

      <div className="footer">
        <p>
          XAUUSD CELESTIAL TERMINAL · Predictions every :00 :15 :30 :45 UTC · Horizon: 15 min · MongoDB Atlas
        </p>
      </div>
    </div>
  );
}
