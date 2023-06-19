/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
};
