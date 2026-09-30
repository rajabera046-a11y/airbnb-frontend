import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        airbnb: "var(--color-rausch)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)"
      },
      boxShadow: {
        popover: "var(--shadow-popover)",
        card: "var(--shadow-card)"
      },
      borderRadius: { panel: "var(--radius-panel)" },
      transitionTimingFunction: { spring: "cubic-bezier(0.32, 0.72, 0, 1)" }
    }
  },
  plugins: []
} satisfies Config;
