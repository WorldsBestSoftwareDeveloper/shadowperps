/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arcium Purple palette
        arcium: {
          950: "#0a0412",
          900: "#120820",
          850: "#180b2e",
          800: "#1e0f3d",
          700: "#2d1660",
          600: "#3d1f82",
          500: "#5b2fd4",
          400: "#7c4ff0",
          300: "#a07bf7",
          200: "#c4adfb",
          100: "#e8dcfd",
          50:  "#f5f0ff",
        },
        neon: {
          purple: "#b44dff",
          blue:   "#4d9fff",
          green:  "#00ffb3",
          red:    "#ff4d6d",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(90,48,210,0.07) 1px, transparent 1px), linear-gradient(to right, rgba(90,48,210,0.07) 1px, transparent 1px)",
        "radial-purple": "radial-gradient(ellipse at 50% 0%, rgba(91,47,212,0.35) 0%, transparent 70%)",
        "radial-blue":   "radial-gradient(ellipse at 100% 100%, rgba(77,159,255,0.15) 0%, transparent 60%)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      animation: {
        "pulse-slow":   "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":        "float 6s ease-in-out infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "scan":         "scan 3s linear infinite",
        "fade-up":      "fadeUp 0.6s ease forwards",
        "slide-in":     "slideIn 0.4s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        glow: {
          "0%":   { boxShadow: "0 0 10px rgba(91,47,212,0.4)" },
          "100%": { boxShadow: "0 0 30px rgba(180,77,255,0.7), 0 0 60px rgba(91,47,212,0.3)" },
        },
        scan: {
          "0%":   { top: "0%" },
          "100%": { top: "100%" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "purple-glow": "0 0 20px rgba(91,47,212,0.5), 0 0 40px rgba(91,47,212,0.2)",
        "neon-purple": "0 0 10px rgba(180,77,255,0.6), 0 0 30px rgba(180,77,255,0.3)",
        "card":        "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover":  "0 8px 40px rgba(91,47,212,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};
