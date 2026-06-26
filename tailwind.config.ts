import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-black": "var(--brand-black)",
        "brand-white": "var(--brand-white)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-dim": "var(--accent-dim)",
        "muted": "var(--muted)",
        "surface": "var(--surface)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      screens: {
        "3xl": "1440px",
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 35s linear infinite",
        "blink-cursor": "blink 1s step-end infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(16,185,129,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(16,185,129,0.35)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.png')",
      },
    },
  },
  plugins: [],
};

export default config;
