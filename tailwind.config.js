/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        anzac: {
          50: "#fbf9eb",
          100: "#f7f1ca",
          200: "#f0e398",
          300: "#e8cc5c",
          400: "#e1ba3d",
          500: "#cf9f23",
          600: "#b37c1b",
          700: "#8f5b19",
          800: "#77491c",
          900: "#663d1d",
        },
        pomegranate: {
          50: "#fef4f2",
          100: "#ffe5e1",
          200: "#ffd1c9",
          300: "#feb0a3",
          400: "#fb836e",
          500: "#f1492c",
          600: "#e03e22",
          700: "#bc3119",
          800: "#9b2c19",
          900: "#812a1b",
        },
        goblin: {
          50: "#f3faf3",
          100: "#e3f5e4",
          200: "#c9e9ca",
          300: "#9ed7a2",
          400: "#6cbc71",
          500: "#47a04e",
          600: "#317736",
          700: "#2d6831",
          800: "#28532b",
          900: "#224526",
        },
        nccGray: {
          50: "#FCFCFC",
          100: "#F8F8F8",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        IBM: ["IBM Plex Sans", "sans-serif"],
        IBMArabic: ["IBM Plex Sans Arabic", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        nccTheme: {
          primary: "#e1ba3d",
          secondary: "#F1492C",
          accent: "#f0e398",
          neutral: "#7F7E86",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
    logs: false,
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("tailwindcss-animate"),
  ],
};
