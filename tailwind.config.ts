import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090D14",
        surface: "#111622",
        "surface-raised": "#182030",
        "surface-card": "#131A26",
        border: "rgba(255, 255, 255, 0.08)",
        "border-strong": "rgba(255, 255, 255, 0.14)",
        primary: {
          DEFAULT: "#38BDF8", // Clean Matte Sky Accent
          foreground: "#000000",
          hover: "#0EA5E9",
        },
        istars: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FCD34D",
        },
        mythic: "#F43F5E",
        immortal: "#A855F7",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        muted: "#94A3B8",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        subtle: "0 2px 8px 0 rgba(0, 0, 0, 0.4)",
        card: "0 4px 16px 0 rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
