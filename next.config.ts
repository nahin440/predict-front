import type { NextConfig } from "next";

const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
  (isProd ? "https://predictxauusd.vercel.app" : "http://localhost:3000");

const nextConfig: NextConfig = {
  compress: true,

  env: {
    // Makes APP_URL available server-side even if not set in env
    APP_URL: appUrl,
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "predictxauusd.vercel.app",
        "localhost:3000",
        "127.0.0.1:3000",
      ],
    },
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
