'use client';

interface RegimeDetailsProps {
  regime: any;
}

export default function RegimeDetails({ regime }: RegimeDetailsProps) {
  if (!regime) return null;
  return (
    <div className="info-box">
      <div className="info-title">🌀 Market Regime</div>
      <div className="regime-row">
        <div className="regime-name">
          <span className="regime-icon">
            {regime.regime === 'TRENDING_BULL' ? '🐂' : regime.regime === 'TRENDING_BEAR' ? '🐻' : regime.regime === 'RANGING' ? '📊' : '⚡'}
          </span>
          <span style={{ fontWeight: '600' }}>{regime.regime}</span>
          <span className="regime-confidence">(Conf: {regime.confidence}%)</span>
        </div>
        <div className="regime-behavior">{regime.expected_behavior}</div>
      </div>
      <div className="regime-details">
        <div>Hurst: {regime.hurst}</div>
        <div>Vol%ile: {regime.vol_percentile}</div>
        <div>Persistence: {regime.trend_persistence}</div>
        <div>Variance Ratio: {regime.variance_ratio}</div>
      </div>
    </div>
  );
}