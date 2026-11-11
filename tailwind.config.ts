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
        "surface-raised": "#161D2B",
        "surface-card": "#121824",
        border: "rgba(255, 255, 255, 0.08)",
        "border-strong": "rgba(255, 255, 255, 0.16)",
        primary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
          hover: "#E2E8F0",
        },
        istars: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FCD34D",
        },
        mythic: "#E11D48",
        immortal: "#9333EA",
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
        subtle: "0 2px 8px 0 rgba(0, 0, 0, 0.5)",
        card: "0 4px 18px 0 rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};
export default config;
