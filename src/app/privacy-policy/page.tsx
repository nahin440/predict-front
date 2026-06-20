import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Privacy Policy — GoldPredict AI" };

const SECTIONS = [
  { title: "1. Information We Collect", content: "We collect name, email, and hashed password when you register. We also collect usage data: pages visited, signals viewed, and interaction timestamps. If you sign in with Google, we receive your Google profile (name, email, avatar) from Firebase Authentication." },
  { title: "2. How We Use Your Information", content: "To provide platform access and signal delivery. To send transactional emails (account verification, password reset, subscription alerts). To analyze platform usage and improve signal quality. We do not sell your data to any third party." },
  { title: "3. Authentication & Security", content: "Passwords are hashed using bcrypt (cost factor 12). We use JWT access tokens (15-minute expiry) and rotating refresh tokens (7-day expiry with reuse detection). All tokens are stored in httpOnly cookies to prevent XSS access." },
  { title: "4. Third-Party Services", content: "Firebase Authentication (Google sign-in), MongoDB Atlas (data storage, US-hosted), and payment processors (Stripe/Paddle, future). These providers have their own privacy policies and data processing agreements." },
  { title: "5. Data Retention", content: "Account data is retained while your account is active. Prediction data is stored indefinitely for historical analysis. You may request full account deletion from your Account Settings page." },
  { title: "6. Your Rights", content: "You have the right to access, correct, or delete your personal data. Contact us at privacy@goldpredict.ai. We will respond within 30 days." },
  { title: "7. Cookies", content: "We use essential httpOnly cookies for authentication only. No third-party advertising cookies. No tracking pixels." },
];

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100dvh" }}>
      <Navbar />
      <div style={{ paddingTop: 120, paddingBottom: 96 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--slate)", marginBottom: 40 }}>Last updated: June 2026</p>
          <div className="card" style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {SECTIONS.map(s => (
                <div key={s.title} style={{ paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--paper)" }}>{s.title}</h2>
                  <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 14, color: "var(--fog)", lineHeight: 1.8 }}>{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
