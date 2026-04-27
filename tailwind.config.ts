import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#08080d",
          elevated: "#0f0f17",
        },
        surface: {
          DEFAULT: "#13131c",
          hover: "#1a1a26",
        },
        border: {
          DEFAULT: "#22222e",
          strong: "#2d2d3d",
        },
        text: {
          DEFAULT: "#e8e6f4",
          muted: "#6b6880",
          dim: "#48465c",
        },
        accent: {
          DEFAULT: "#7c6cff",
          glow: "#9c8aff",
          deep: "#5a4fd9",
        },
        success: "#3ecf7e",
        warning: "#f5a623",
        danger: "#f54e4e",
        magenta: "#ff5cb1",
        cyan: "#5ce0ff",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-clash)", "var(--font-dm-sans)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124, 108, 255, 0.25), 0 8px 30px -8px rgba(124, 108, 255, 0.45)",
        soft: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(ellipse at top, rgba(124,108,255,0.15), transparent 60%)",
        "accent-gradient": "linear-gradient(135deg, #7c6cff 0%, #ff5cb1 50%, #5ce0ff 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 400ms ease-out",
        "slide-up": "slideUp 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        "shimmer": "shimmer 2.2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
