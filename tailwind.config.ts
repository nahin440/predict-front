import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"]
      },
      colors: {
        gold: { 300:"#fcd34d", 400:"#fbbf24", 500:"#f59e0b", 600:"#d97706", 700:"#b45309" },
        up:   "#00d97e",
        down: "#ff4560",
        bg:   { 0:"#050507", 1:"#09090d", 2:"#0e0e14", 3:"#141419", 4:"#1a1a22" }
      },
      borderRadius: { sm:"8px", md:"14px", lg:"20px", xl:"28px" },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease both",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 1.6s ease-in-out infinite",
        "ticker": "ticker-scroll 40s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        "fade-up": { from:{ opacity:"0", transform:"translateY(24px)" }, to:{ opacity:"1", transform:"translateY(0)" } },
        "fade-in": { from:{ opacity:"0" }, to:{ opacity:"1" } },
        "float": { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-8px)" } },
        "shimmer": { "0%":{ backgroundPosition:"200% 0" }, "100%":{ backgroundPosition:"-200% 0" } },
        "ticker-scroll": { "0%":{ transform:"translateX(0)" }, "100%":{ transform:"translateX(-50%)" } },
        "spin-slow": { to:{ transform:"rotate(360deg)" } },
        "glow-pulse": { "0%,100%":{ boxShadow:"0 0 20px rgba(245,158,11,0.3)" }, "50%":{ boxShadow:"0 0 40px rgba(245,158,11,0.6)" } },
        "pulse-ring": { "0%,100%":{ opacity:"0.6", transform:"scale(1)" }, "50%":{ opacity:"0.2", transform:"scale(1.5)" } },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
        "dark-gradient": "linear-gradient(180deg, #050507 0%, #09090d 100%)",
      }
    }
  },
  plugins: []
};

export default config;
