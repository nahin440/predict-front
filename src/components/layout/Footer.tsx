import Link from "next/link";

const LINKS = {
  Platform: [
    { href: "/predictions", label: "Live Signals" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" }
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/gold-price-forecast", label: "Gold Forecast" },
    { href: "/gold-market-analysis", label: "Market Analysis" }
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" }
  ]
};

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-icon">
                <span className="footer-logo-text">Au</span>
              </div>
              <span className="footer-logo-name">Gold<span className="footer-logo-accent">Predict</span></span>
            </Link>
            <p className="footer-desc">
              Institutional-grade AI signals for XAUUSD traders. Machine learning meets market structure — updated every 15 minutes.
            </p>
            <div className="footer-live">
              <div className="live-dot" style={{ width: 6, height: 6 }} />
              <span className="footer-live-text">SYSTEM OPERATIONAL</span>
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="footer-group-label">{group}</p>
              <ul className="footer-link-list">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} GoldPredict AI. All rights reserved.</p>
          <p className="footer-disclaimer">
            ⚠️ Trading involves substantial risk. AI signals are for informational purposes only, not financial advice.
          </p>
        </div>
      </div>

      <style>{`
        .footer-root { background: var(--bg-0); border-top: 1px solid var(--bdr-1); }
        .footer-inner { max-width: 1280px; margin: 0 auto; padding: 64px 24px 40px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-brand {}
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 16px; }
        .footer-logo-icon { width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg,#fbbf24,#d97706); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-logo-text { font-family: 'DM Mono',monospace; font-weight: 700; font-size: 12px; color: #0a0800; }
        .footer-logo-name { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 17px; color: var(--tx-0); letter-spacing: -0.03em; }
        .footer-logo-accent { color: #f59e0b; }
        .footer-desc { font-family: 'DM Sans',sans-serif; font-size: 13px; color: var(--tx-2); line-height: 1.6; max-width: 280px; margin-bottom: 20px; }
        .footer-live { display: flex; align-items: center; gap: 6px; }
        .footer-live-text { font-family: 'DM Mono',monospace; font-size: 10px; color: #00d97e; letter-spacing: 0.08em; }
        .footer-group-label { font-family: 'DM Mono',monospace; font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.12em; color: var(--tx-3); margin-bottom: 16px; }
        .footer-link-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-link { font-family: 'DM Sans',sans-serif; font-size: 13px; color: var(--tx-2); text-decoration: none; transition: color 0.15s ease; }
        .footer-link:hover { color: #f59e0b; }
        .footer-bottom { padding-top: 32px; border-top: 1px solid var(--bdr-0); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-family: 'DM Mono',monospace; font-size: 11px; color: var(--tx-3); }
        .footer-disclaimer { font-family: 'DM Sans',sans-serif; font-size: 11px; color: var(--tx-3); max-width: 480px; text-align: right; line-height: 1.5; }
        @media(max-width:900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:600px) { .footer-grid { grid-template-columns: 1fr; } .footer-disclaimer { text-align: left; } }
      `}</style>
    </footer>
  );
}
