import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Self-hosted, zero-network-roundtrip font loading via next/font.
// Eliminates the render-blocking <link> + @import double-load that was
// causing 3-8s navigation delays.
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

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
  width: "device-width", initialScale: 1, maximumScale: 5, themeColor: "#080809"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body style={{ background: "#080809", color: "#f0f0f5" }}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#111114",
                color: "#f0f0f5",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                fontSize: "13px",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                maxWidth: "calc(100vw - 32px)",
              },
              success: { iconTheme: { primary: "#f5a623", secondary: "#080809" } },
              error: { iconTheme: { primary: "#ff3d57", secondary: "#fff" } }
            }}
          />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
