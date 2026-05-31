'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

// ── Ticker tape items ─────────────────────────────────────
const TICKER_ITEMS = [
  { label: 'XAU/USD', val: '—', id: 'price' },
  { label: 'SIGNAL',  val: '—', id: 'signal' },
  { label: 'GRADE',   val: '—', id: 'grade' },
  { label: 'ADX',     val: '—', id: 'adx' },
  { label: 'RSI',     val: '—', id: 'rsi' },
  { label: 'ATR',     val: '—', id: 'atr' },
  { label: 'DXY',     val: '—', id: 'dxy' },
  { label: 'VIX',     val: '—', id: 'vix' },
  { label: 'SESSION', val: '—', id: 'session' },
];

export default function Home() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const timestamp = Date.now();
      const [latestRes, historyRes] = await Promise.all([
        fetch(`/api/predictions/latest?t=${timestamp}`),
        fetch(`/api/predictions?limit=50&t=${timestamp}`),
      ]);
      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      if (latestData.prediction) setLatest(latestData.prediction);
      setPredictions(historyData.predictions || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getCombinedSignal = (pred: any) => {
    const dir = pred.direction;
    if (dir !== 'UP' && dir !== 'DOWN') return 'NO SIGNAL';
    const grade = pred.grade || '';
    const isStrong = grade === 'A+' || grade === 'A';
    return `${isStrong ? 'STRONG' : 'WEAK'} ${dir === 'UP' ? 'LONG' : 'SHORT'}`;
  };

  const getSignalColor = (combined: string) => {
    if (combined.includes('LONG'))  return 'var(--green)';
    if (combined.includes('SHORT')) return 'var(--red)';
    return 'var(--text-muted)';
  };

  // Build live ticker data
  const tickerData = latest ? [
    { label: 'XAU/USD', val: `$${latest.current_price?.toFixed(2)}`, positive: null },
    { label: 'SIGNAL',  val: getCombinedSignal(latest), positive: getCombinedSignal(latest).includes('LONG') },
    { label: 'GRADE',   val: `${latest.grade || '?'}`, positive: null },
    { label: 'ADX',     val: latest.adx?.toFixed(1), positive: null },
    { label: 'RSI',     val: latest.rsi?.toFixed(1), positive: null },
    { label: 'ATR',     val: `$${latest.atr?.toFixed(2)}`, positive: null },
    { label: 'DXY',     val: `${latest.dxy_return?.toFixed(2)}%`, positive: latest.dxy_return < 0 },
    { label: 'VIX',     val: latest.vix?.toFixed(1) || 'N/A', positive: null },
    { label: 'SESSION', val: latest.session_name || '—', positive: null },
  ] : TICKER_ITEMS;

  if (loading) {
    return (
      <div className="loading" data-theme={theme}>
        <div className="loading-spinner" />
        <div className="loading-text">Initialising Terminal…</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[0,1,2].map(i => (
            <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const isValidTrade = latest && latest.direction !== 'N/A' && latest.risk?.sl > 0;
  const combinedSignal = latest ? getCombinedSignal(latest) : '';

  return (
    <div className="container">

      {/* ── Header ── */}
      <div className="header">
        <div className="header-logo">
          <h1>⬡ XAUUSD PREDICTOR</h1>
          <p>Real‑time 15‑min horizon · updates every 30s · MongoDB Atlas</p>
        </div>

        <div className="header-right">
          <div className="last-updated">
            <div className="last-updated-label">Last Updated</div>
            <div className="last-updated-time">{lastUpdated.toLocaleTimeString()}</div>
          </div>

          <button
            className={`refresh-btn${isRefreshing ? ' spinning' : ''}`}
            onClick={fetchData}
          >
            <span className="refresh-icon" style={{ display: 'inline-block' }}>⟳</span>
            Refresh
          </button>

          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link href="/btc">
            <button className="switch-btn">₿ BTC →</button>
          </Link>
        </div>
      </div>

      {/* ── Ticker Tape ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...tickerData, ...tickerData].map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="ticker-label">{item.label}</span>
              <span
                className="ticker-val"
                style={{
                  color: item.positive === true
                    ? 'var(--green)'
                    : item.positive === false
                    ? 'var(--red)'
                    : 'var(--text-primary)',
                }}
              >
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Latest Prediction Card ── */}
      {latest && (
        <>
          <div className="card card-active">
            <div className="card-header">
              <div>
                <div className="time">🕐 {latest.server_time} → {latest.target_time}</div>
                <div className="direction-price">
                  <span className="direction" style={{ color: getSignalColor(combinedSignal) }}>
                    {combinedSignal}
                  </span>
                  <span className="price" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    ${latest.current_price?.toFixed(2)}
                  </span>
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
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem',
                  letterSpacing: '0.08em'
                }}>
                  QUALITY SCORE
                </div>
              </div>
            </div>

            {/* Progress bar for quality score */}
            <div className="progress-bar-wrap" style={{ marginTop: '1rem' }}>
              <div
                className="progress-bar"
                style={{ width: `${latest.confluence?.quality_score ?? latest.confidence ?? 0}%` }}
              />
            </div>

            <div className="metrics-grid stagger" style={{ marginTop: '1rem' }}>
              {[
                { label: 'ML Conf',    val: `${latest.confidence?.toFixed(1)}%` },
                { label: 'Effective',  val: `${latest.effective_confidence?.toFixed(1)}%`, cls: 'metric-value-yellow' },
                { label: 'P(UP)',      val: `${latest.prob_up ? (latest.prob_up * 100).toFixed(1) : 0}%` },
                { label: 'ADX',        val: latest.adx?.toFixed(1) },
                { label: 'ATR',        val: `$${latest.atr?.toFixed(2)}` },
                { label: 'Spread',     val: `${latest.spread_points}pts`, cls: 'metric-value-yellow' },
                { label: 'Session',    val: latest.session_name || '—' },
                { label: 'Signal',     val: combinedSignal.split(' ')[0] },
              ].map(({ label, val, cls }, i) => (
                <div key={i} className="metric" style={{ animationDelay: `${i * 0.05 + 0.3}s` }}>
                  <div className="metric-label">{label}</div>
                  <div className={`metric-value ${cls || ''}`}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Checklist & Plan */}
          {isValidTrade && <TradeChecklist prediction={latest} />}
          {isValidTrade && (
            <TradePlanCard
              risk={latest.risk}
              direction={latest.direction}
              currentPrice={latest.current_price}
            />
          )}

          {/* Structure */}
          <StructureDetails
            structure={latest.structure}
            atr={latest.atr}
            currentPrice={latest.current_price}
          />

          {/* Multi-TF + Regime */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}>
            <div className="info-box">
              <div className="info-title">📡 Multi‑Timeframe Alignment</div>
              <div className="alignment-stats" style={{ marginBottom: '0.75rem' }}>
                <div>Bullish TFs: <span className="bullish-text">{latest.bull_htf_count ?? 0}/4</span></div>
                <div>Bearish TFs: <span className="bearish-text">{latest.bear_htf_count ?? 0}/4</span></div>
              </div>
              {latest.snapshot && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.4rem',
                  fontSize: '0.7rem',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {[
                    { tf: 'M5',  val: latest.snapshot.m5_price_vs_ema20 },
                    { tf: 'M15', val: latest.snapshot.m15_price_vs_ema20 },
                    { tf: 'H1',  val: latest.snapshot.h1_price_vs_ema20 },
                    { tf: 'H4',  val: latest.snapshot.h4_price_vs_ema20 },
                  ].map(({ tf, val }) => (
                    <div key={tf} style={{
                      padding: '0.4rem',
                      background: 'var(--bg-glass-light)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: '0.4rem',
                      textAlign: 'center',
                    }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{tf}</div>
                      <div style={{ color: val > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                        {val?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <RegimeDetails regime={latest.regime} />
          </div>

          <RiskDetails risk={latest.risk} />
          <ConfluenceDetails confluence={latest.confluence} grade={latest.grade} />
          <TechnicalSnapshot
            snapshot={latest.snapshot}
            adx={latest.adx}
            rsi={latest.rsi}
            atr={latest.atr}
          />
          <MacroDetails
            dxyReturn={latest.dxy_return}
            yieldChange={latest.yield_change}
            yield10y={latest.yield_10y}
            yieldSpread={latest.yield_spread}
            vix={latest.vix}
            spxReturn={latest.spx_return}
            oilReturn={latest.oil_return}
          />

          <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setSelectedPrediction(latest)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                padding: '0.6rem 1.5rem',
                borderRadius: '0.6rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.borderColor = 'var(--border-accent)';
                (e.target as HTMLButtonElement).style.color = 'var(--text-accent)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                (e.target as HTMLButtonElement).style.color = 'var(--text-muted)';
              }}
            >
              🔍 VIEW FULL JSON DATA
            </button>
          </div>
        </>
      )}

      {/* ── History Table ── */}
      <div className="history-table">
        <div className="history-header">
          <h2>📜 Prediction History</h2>
          <span style={{
            marginLeft: 'auto',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>LAST 50 RECORDS</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Price</th>
                <th>Signal</th>
                <th>Confidence</th>
                <th>Grade</th>
                <th>Regime</th>
                <th>Session</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred: any) => {
                const dir = pred.direction;
                let combined = 'NO SIGNAL';
                if (dir === 'UP' || dir === 'DOWN') {
                  const g = pred.grade || '';
                  combined = `${g === 'A+' || g === 'A' ? 'STRONG' : 'WEAK'} ${dir === 'UP' ? 'LONG' : 'SHORT'}`;
                }
                const sigColor = combined.includes('LONG') ? 'var(--green)' : combined.includes('SHORT') ? 'var(--red)' : 'var(--text-muted)';
                return (
                  <tr key={pred._id} onClick={() => setSelectedPrediction(pred)}>
                    <td>{pred.server_time?.slice(5, 16)}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      ${pred.current_price?.toFixed(2)}
                    </td>
                    <td style={{ fontWeight: 700, color: sigColor, fontFamily: "'Space Mono', monospace", fontSize: '0.7rem' }}>
                      {combined}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {pred.confidence?.toFixed(0)}%
                    </td>
                    <td>
                      <span
                        className={`grade-badge grade-${pred.grade?.replace('+', '-plus') || 'D'}`}
                        style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}
                      >
                        {pred.grade || '?'}
                      </span>
                    </td>
                    <td style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem' }}>
                      {pred.regime?.regime?.replace('TRENDING_', '') || '?'}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{pred.session_name || '—'}</td>
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

      <Glossary />

      <div className="footer">
        <p>⬡ Predictions every :00 :15 :30 :45 UTC · Horizon: 15 min · Data from MongoDB Atlas (xau_dashboard)</p>
      </div>
    </div>
  );
}
