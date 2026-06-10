'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TbRefresh, TbDatabase, TbChevronDown, TbChevronUp,
  TbArrowNarrowUp, TbArrowNarrowDown, TbMinus,
  TbLayoutDashboard, TbChartCandle, TbShieldCheck,
  TbLayersLinked, TbChartBar, TbBook2, TbAlertTriangle,
  TbClockHour4, TbTargetArrow,
} from 'react-icons/tb';
import { RiBarChartGroupedFill } from 'react-icons/ri';

import TradeChecklist    from './components/TradeChecklist';
import TradePlanCard     from './components/TradePlanCard';
import StructureDetails  from './components/StructureDetails';
import RiskDetails       from './components/RiskDetails';
import ConfluenceDetails from './components/ConfluenceDetails';
import RegimeDetails     from './components/RegimeDetails';
import TechnicalSnapshot from './components/TechnicalSnapshot';
import MacroDetails      from './components/MacroDetails';
import FullPredictionModal from './components/FullPredictionModal';
import Glossary          from './components/Glossary';

/* ─────────────────────────────────────────
   Inline SVG Gear for header decoration
───────────────────────────────────────── */
function GearSVG({ size = 22, speed = 14, reverse = false, color = 'rgba(0,198,215,0.30)' }: {
  size?: number; speed?: number; reverse?: boolean; color?: string;
}) {
  const teeth = 10;
  const r1 = size * 0.36, r2 = size * 0.47;
  const step = (Math.PI * 2) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step - step * 0.4, a1 = i * step - step * 0.15;
    const a2 = i * step + step * 0.15, a3 = i * step + step * 0.4;
    const cx = size / 2, cy = size / 2;
    if (i === 0) d += `M${(cx + r1 * Math.cos(a0)).toFixed(2)},${(cy + r1 * Math.sin(a0)).toFixed(2)}`;
    else         d += `L${(cx + r1 * Math.cos(a0)).toFixed(2)},${(cy + r1 * Math.sin(a0)).toFixed(2)}`;
    d += `L${(cx + r2 * Math.cos(a1)).toFixed(2)},${(cy + r2 * Math.sin(a1)).toFixed(2)}`;
    d += `L${(cx + r2 * Math.cos(a2)).toFixed(2)},${(cy + r2 * Math.sin(a2)).toFixed(2)}`;
    d += `L${(cx + r1 * Math.cos(a3)).toFixed(2)},${(cy + r1 * Math.sin(a3)).toFixed(2)}`;
  }
  d += 'Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', flexShrink: 0 }}>
      <g style={{ transformOrigin: `${size/2}px ${size/2}px`, animation: `${reverse ? 'gearSpinReverse' : 'gearSpin'} ${speed}s linear infinite` }}>
        <path d={d} fill={color} stroke={color} strokeWidth="0.5" />
        <circle cx={size/2} cy={size/2} r={r1 * 0.64} fill="none" stroke={color} strokeWidth="0.7" />
        <circle cx={size/2} cy={size/2} r={size * 0.07} fill={color} />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const TABS = [
  { id: 'overview',   label: 'Overview',   icon: <TbLayoutDashboard size={13} /> },
  { id: 'technical',  label: 'Technical',  icon: <TbChartCandle size={13} /> },
  { id: 'risk',       label: 'Risk',       icon: <TbShieldCheck size={13} /> },
  { id: 'structure',  label: 'Structure',  icon: <TbLayersLinked size={13} /> },
  { id: 'macro',      label: 'Macro',      icon: <TbChartBar size={13} /> },
  { id: 'glossary',   label: 'Glossary',   icon: <TbBook2 size={13} /> },
];

function getCombinedSignal(pred: any) {
  if (pred.signal_strength && pred.signal_strength !== 'NO TRADE') return pred.signal_strength;
  const dir = pred.direction;
  if (dir !== 'UP' && dir !== 'DOWN') return 'NO SIGNAL';
  return `WEAK ${dir === 'UP' ? 'LONG' : 'SHORT'}`;
}

function getSignalColors(s: string) {
  if (s.includes('LONG'))  return { text: 'var(--bull)', bg: 'var(--bull-ghost)', border: 'var(--bull-border)' };
  if (s.includes('SHORT')) return { text: 'var(--bear)', bg: 'var(--bear-ghost)', border: 'var(--bear-border)' };
  return { text: 'var(--text-muted)', bg: 'rgba(255,255,255,0.03)', border: 'var(--border-faint)' };
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function Home() {
  const [predictions, setPredictions]         = useState<any[]>([]);
  const [latest, setLatest]                   = useState<any>(null);
  const [loading, setLoading]                 = useState(true);
  const [lastUpdated, setLastUpdated]         = useState(new Date());
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [isRefreshing, setIsRefreshing]       = useState(false);
  const [activeTab, setActiveTab]             = useState('overview');
  const [expandRaw, setExpandRaw]             = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  /* Anime.js entrance on data load */
  const runEntrance = useCallback(() => {
    if (typeof window === 'undefined' || !(window as any).anime) return;
    const anime = (window as any).anime;
    anime({
      targets: '.signal-card, .info-box, .trade-plan, .history-table',
      opacity: [0, 1],
      translateY: [18, 0],
      delay: anime.stagger(55, { start: 80 }),
      duration: 550,
      easing: 'easeOutExpo',
    });
    anime({
      targets: '.grade-badge',
      scale: [0.7, 1],
      opacity: [0, 1],
      delay: anime.stagger(40, { start: 200 }),
      duration: 400,
      easing: 'easeOutBack',
    });
  }, []);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const ts = Date.now();
      const [latestRes, historyRes] = await Promise.all([
        fetch(`/api/predictions/latest?t=${ts}`),
        fetch(`/api/predictions?limit=50&t=${ts}`),
      ]);
      const latestData  = await latestRes.json();
      const historyData = await historyRes.json();
      if (latestData.prediction) setLatest(latestData.prediction);
      setPredictions(historyData.predictions || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setTimeout(() => { setIsRefreshing(false); runEntrance(); }, 200);
    }
  }, [runEntrance]);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="loading">
        <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner" />
          <div style={{ position: 'absolute' }}>
            <GearSVG size={28} speed={6} color="rgba(0,198,215,0.5)" />
          </div>
        </div>
        <div className="loading-text">Initialising Apex Terminal</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 6, height: 6, background: 'var(--cyan)', borderRadius: '50%', animation: `pulse 1.2s ${i*0.3}s ease infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  const combinedSignal  = latest ? getCombinedSignal(latest) : '';
  const signalColors    = getSignalColors(combinedSignal);
  const isLong          = latest?.direction === 'UP';
  const isShort         = latest?.direction === 'DOWN';
  const isValidTrade    = latest && latest.direction !== 'N/A' && latest.risk?.sl > 0;

  /* Ticker data */
  const tickerData = latest ? [
    { label: 'XAU/USD',   val: `$${latest.current_price?.toFixed(2)}`,        positive: null },
    { label: 'SIGNAL',    val: getCombinedSignal(latest),                      positive: getCombinedSignal(latest).includes('LONG') },
    { label: 'GRADE',     val: latest.grade || '?',                            positive: null },
    { label: 'ADX',       val: latest.adx?.toFixed(1),                         positive: null },
    { label: 'RSI',       val: latest.rsi?.toFixed(1),                         positive: null },
    { label: 'ATR',       val: `$${latest.atr?.toFixed(2)}`,                  positive: null },
    { label: 'DXY 1D',    val: `${latest.dxy_return?.toFixed(2)}%`,           positive: latest.dxy_return < 0 },
    { label: 'VIX',       val: latest.vix?.toFixed(1) || 'N/A',               positive: null },
    { label: 'SESSION',   val: latest.session_name || '—',                     positive: null },
    { label: 'REGIME',    val: latest.regime_name || '—',                      positive: null },
    { label: 'SKIP',      val: latest.should_skip ? 'SKIP' : 'TRADE',         positive: !latest.should_skip },
    { label: 'EFF.CONF',  val: `${latest.effective_confidence}%`,              positive: null },
  ] : [
    { label: 'XAU/USD', val: '—', positive: null },
    { label: 'SIGNAL',  val: '—', positive: null },
    { label: 'GRADE',   val: '—', positive: null },
  ];

  const doubled = [...tickerData, ...tickerData];

  /* Data item row style */
  const dataRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.42rem 0.65rem',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-faint)',
    borderRadius: '0.4rem',
  };

  return (
    <div className="container" ref={mainRef}>

      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GearSVG size={22} speed={14} color="rgba(0,198,215,0.45)" />
            <GearSVG size={15} speed={9} reverse color="rgba(245,166,35,0.40)" />
            <h1>XAU<span>/USD</span></h1>
          </div>
          <div className="header-subtitle">Apex Terminal · ML Prediction Engine · 15-min Horizon</div>
        </div>

        <div className="header-right">
          <div className="live-badge">LIVE</div>
          <div className="last-updated">
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-dim)',
              borderRadius: '0.4rem',
              color: 'var(--text-secondary)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem', letterSpacing: '0.08em',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              transition: 'var(--transition)',
              opacity: isRefreshing ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!isRefreshing) { const b = e.currentTarget; b.style.borderColor = 'var(--border-subtle)'; b.style.color = 'var(--cyan)'; }}}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'var(--border-dim)'; b.style.color = 'var(--text-secondary)'; }}
          >
            <TbRefresh size={13} style={{ animation: isRefreshing ? 'gearSpin 0.8s linear infinite' : 'none' }} />
            REFRESH
          </button>
        </div>
      </header>

      {/* ── Ticker Tape ── */}
      <div className="ticker-wrap">
        <div className="ticker-tape">
          {doubled.map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="ticker-label">{item.label}</span>
              <span className={`ticker-val ${item.positive === true ? 'positive' : item.positive === false ? 'negative' : ''}`}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Nav Tabs ── */}
      <nav className="nav-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ════════════════════════════════════════
          TAB: OVERVIEW
      ════════════════════════════════════════ */}
      {activeTab === 'overview' && latest && (
        <>
          {/* Skip warning */}
          {latest.should_skip && (
            <div className="skip-banner" style={{ marginBottom: '1rem' }}>
              <TbAlertTriangle size={16} style={{ color: 'var(--bear)', flexShrink: 0 }} />
              <div>
                <div className="skip-banner-text">SKIP TRADE — Signal filtered</div>
                {latest.skip_reason && (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {latest.skip_reason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Signal Card */}
          <div className={`signal-card ${isShort ? 'bear-signal' : ''}`}>
            <div className="signal-header">

              {/* Direction + Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="signal-direction">
                  <div className={`direction-badge ${isLong ? 'long' : isShort ? 'short' : 'neutral'}`}>
                    {isLong ? <TbArrowNarrowUp size={16} /> : isShort ? <TbArrowNarrowDown size={16} /> : <TbMinus size={16} />}
                    {isLong ? 'LONG' : isShort ? 'SHORT' : 'NEUTRAL'}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.28rem 0.75rem',
                    background: signalColors.bg,
                    border: `1px solid ${signalColors.border}`,
                    borderRadius: '999px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    color: signalColors.text,
                    letterSpacing: '0.05em',
                  }}>
                    {combinedSignal}
                  </div>
                </div>
                <div>
                  <div className="price-display">${latest.current_price?.toFixed(2)}</div>
                  <div className="price-label">XAU/USD · Target: {latest.target_time?.slice(11,16)} UTC</div>
                </div>
              </div>

              {/* Confidence */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <div className="confidence-val">{latest.confidence?.toFixed(1)}%</div>
                  <div className="price-label">ML Confidence</div>
                </div>
                <div>
                  <div className="confidence-val" style={{ color: 'var(--amber)' }}>{latest.effective_confidence?.toFixed(1)}%</div>
                  <div className="price-label">Effective Conf.</div>
                </div>
                <div className="grade-display">
                  <span className={`grade-badge grade-${(latest.grade || 'D').replace('+', '-plus')}`} style={{ fontSize: '1.1rem', padding: '0.3rem 0.9rem' }}>
                    {latest.grade || '?'}
                  </span>
                  <div className="price-label">Grade</div>
                </div>
              </div>

              {/* Key stats pills */}
              <div className="stats-row" style={{ flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                {[
                  { label: 'Session', val: latest.session_name || '—' },
                  { label: 'Regime',  val: (latest.regime?.regime || '—').replace('TRENDING_', '') },
                  { label: 'Horizon', val: `${latest.horizon} min` },
                  { label: 'Status',  val: latest.should_skip ? 'SKIP' : 'TRADE', color: latest.should_skip ? 'var(--bear)' : 'var(--bull)' },
                ].map(({ label, val, color }: any) => (
                  <div key={label} className="stat-pill">
                    <span className="stat-pill-label">{label}</span>
                    <span className="stat-pill-val" style={{ color: color || 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar: confidence */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>CONFIDENCE</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)' }}>{latest.confidence?.toFixed(1)}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${latest.confidence ?? 0}%`, background: 'linear-gradient(90deg, var(--cyan-dim), var(--cyan))' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>EFFECTIVE CONFIDENCE</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)' }}>{latest.effective_confidence?.toFixed(1)}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${latest.effective_confidence ?? 0}%`, background: 'linear-gradient(90deg, var(--amber-dim), var(--amber))' }} />
              </div>
            </div>
          </div>

          {/* Trade Plan + Checklist */}
          {isValidTrade && (
            <div className="section-2col" style={{ marginBottom: '1rem' }}>
              <TradePlanCard risk={latest.risk} direction={latest.direction} currentPrice={latest.current_price} />
              <TradeChecklist prediction={latest} />
            </div>
          )}

          {/* Regime + Confluence */}
          <div className="section-2col" style={{ marginBottom: '1rem' }}>
            <RegimeDetails regime={latest.regime} />
            <ConfluenceDetails confluence={latest.confluence} grade={latest.grade} />
          </div>

          {/* Extra data */}
          <div className="info-box" style={{ marginBottom: '1rem' }}>
            <div className="section-title">
              <TbDatabase size={13} style={{ color: 'var(--cyan)' }} />
              Additional Data
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.4rem' }}>
              {[
                { k: 'P(UP)',           v: `${(latest.prob_up * 100)?.toFixed(1)}%` },
                { k: 'ADX',            v: latest.adx?.toFixed(1) },
                { k: 'RSI',            v: latest.rsi?.toFixed(1) },
                { k: 'ATR',            v: `$${latest.atr?.toFixed(2)}` },
                { k: 'Spread',         v: `${latest.spread_points} pts` },
                { k: 'Slippage',       v: `${latest.slippage_points} pts` },
                { k: 'Total Cost',     v: `${latest.total_cost_points} pts` },
                { k: 'EV OK',          v: latest.ev_ok ? 'Yes' : 'No' },
                { k: 'HTF OK',         v: latest.htf_ok ? 'Yes' : 'No' },
                { k: 'Raw Prob UP',    v: `${(latest.raw_prob_up * 100)?.toFixed(1)}%` },
                { k: 'Yield 10Y',      v: `${latest.yield_10y?.toFixed(3)}%` },
                { k: 'ATR Percentile', v: `${(latest.atr_percentile * 100)?.toFixed(0)}%` },
              ].map(({ k, v }) => (
                <div key={k} style={dataRowStyle}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>

            {latest.model_votes && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' as const }}>
                  Model Votes
                </div>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {Object.entries(latest.model_votes).map(([model, vote]: [string, any]) => (
                    <div key={model} style={{
                      padding: '0.28rem 0.7rem',
                      background: 'var(--bg-surface)',
                      border: `1px solid ${vote > 0.5 ? 'rgba(0,211,127,0.15)' : 'rgba(255,69,96,0.15)'}`,
                      borderRadius: '0.4rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.56rem' }}>{model.toUpperCase()} </span>
                      <span style={{ fontWeight: 700, color: vote > 0.5 ? 'var(--bull)' : 'var(--bear)' }}>
                        {(vote * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View Raw JSON toggle */}
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setExpandRaw(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 1.25rem',
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '0.4rem',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.64rem', letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = 'var(--cyan-border)'; b.style.color = 'var(--cyan)'; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'var(--border-dim)'; b.style.color = 'var(--text-muted)'; }}
              >
                {expandRaw ? <TbChevronUp size={13} /> : <TbChevronDown size={13} />}
                {expandRaw ? 'HIDE' : 'VIEW'} RAW JSON
              </button>
            </div>
            {expandRaw && (
              <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', lineHeight: 1.6, overflow: 'auto', background: 'var(--bg-base)', border: '1px solid var(--border-faint)', padding: '1rem', borderRadius: '0.5rem', color: 'var(--text-secondary)', maxHeight: '360px', marginTop: '0.75rem' }}>
                {JSON.stringify(latest, null, 2)}
              </pre>
            )}
          </div>
        </>
      )}

      {/* ════════════════════════════════════════
          TAB: TECHNICAL
      ════════════════════════════════════════ */}
      {activeTab === 'technical' && latest && (
        <TechnicalSnapshot
          snapshot={latest.snapshot}
          adx={latest.adx}
          rsi={latest.rsi}
          atr={latest.atr}
        />
      )}

      {/* ════════════════════════════════════════
          TAB: RISK
      ════════════════════════════════════════ */}
      {activeTab === 'risk' && latest && (
        <>
          <RiskDetails risk={latest.risk} />
          {isValidTrade && (
            <TradePlanCard risk={latest.risk} direction={latest.direction} currentPrice={latest.current_price} />
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          TAB: STRUCTURE
      ════════════════════════════════════════ */}
      {activeTab === 'structure' && latest && (
        <StructureDetails
          structure={latest.structure}
          atr={latest.atr}
          currentPrice={latest.current_price}
        />
      )}

      {/* ════════════════════════════════════════
          TAB: MACRO
      ════════════════════════════════════════ */}
      {activeTab === 'macro' && latest && (
        <MacroDetails
          dxyReturn={latest.dxy_return}
          yieldChange={latest.yield_change}
          yield10y={latest.yield_10y}
          yieldSpread={latest.yield_spread}
          vix={latest.vix}
          spxReturn={latest.spx_return}
          oilReturn={latest.oil_return}
        />
      )}

      {/* ════════════════════════════════════════
          TAB: GLOSSARY
      ════════════════════════════════════════ */}
      {activeTab === 'glossary' && <Glossary />}

      {/* ── Prediction History Table (always visible below tabs) ── */}
      <div className="divider-cn">
        <TbClockHour4 size={13} />
        Prediction History
      </div>

      <div className="history-table">
        <div className="history-header">
          <GearSVG size={14} speed={18} reverse color="rgba(0,198,215,0.4)" />
          <h2>Recent Predictions</h2>
          <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
            LAST 50
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
                const sigColor = combined.includes('LONG') ? 'var(--bull)' : combined.includes('SHORT') ? 'var(--bear)' : 'var(--text-muted)';
                return (
                  <tr key={pred._id} onClick={() => setSelectedPrediction(pred)}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{pred.server_time?.slice(5,16)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${pred.current_price?.toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: sigColor, fontSize: '0.65rem' }}>{combined}</td>
                    <td style={{ fontWeight: 700, color: pred.direction === 'UP' ? 'var(--bull)' : 'var(--bear)' }}>
                      {pred.direction === 'UP' ? '▲' : '▼'} {pred.direction}
                    </td>
                    <td>{pred.confidence?.toFixed(0)}%</td>
                    <td style={{ color: 'var(--cyan)' }}>{pred.effective_confidence?.toFixed(0)}%</td>
                    <td>
                      <span className={`grade-badge grade-${pred.grade?.replace('+','-plus') || 'D'}`} style={{ fontSize: '0.58rem', padding: '0.1rem 0.4rem' }}>
                        {pred.grade || '?'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{pred.regime?.regime?.replace('TRENDING_','') || '?'}</td>
                    <td>{pred.adx?.toFixed(1)}</td>
                    <td>{pred.rsi?.toFixed(1)}</td>
                    <td style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{pred.session_name || '—'}</td>
                    <td>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: pred.should_skip ? 'var(--bear)' : 'var(--bull)' }}>
                        {pred.should_skip ? 'SKIP' : 'OK'}
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

      <footer className="footer">
        <p>XAUUSD APEX TERMINAL · Predictions every :00 :15 :30 :45 UTC · 15-min Horizon · MongoDB Atlas</p>
      </footer>
    </div>
  );
}
