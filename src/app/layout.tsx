import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://goldpredict.ai"),
  title: { default: "GoldPredict AI — XAUUSD Signal Intelligence", template: "%s | GoldPredict AI" },
  description: "AI-powered XAUUSD gold trading signals with machine learning confidence scores, market regime detection, ICT structure analysis, and real-time risk management.",
  keywords: ["XAUUSD", "gold trading signals", "AI trading", "gold price forecast", "XAU/USD prediction", "forex signals", "market regime"],
  openGraph: {
    type: "website", siteName: "GoldPredict AI",
    title: "GoldPredict AI — XAUUSD Signal Intelligence",
    description: "Institutional-grade AI signals for gold traders. Updated every 15 minutes.",
    images: [{ url: "/og.png", width: 1200, height: 630 }]
  },
  twitter: { card: "summary_large_image", title: "GoldPredict AI" },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, themeColor: "#050507"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: "#050507", color: "#f0f0f5" }}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#141419",
                color: "#f0f0f5",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                fontSize: "13px",
                fontFamily: "DM Sans, sans-serif",
                boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
              },
              success: { iconTheme: { primary: "#f59e0b", secondary: "#050507" } },
              error: { iconTheme: { primary: "#ff4560", secondary: "#fff" } }
            }}
          />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
