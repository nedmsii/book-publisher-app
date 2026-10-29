import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#faefd9",
          200: "#f4dcb0",
          300: "#ecc47d",
          400: "#e3a449",
          500: "#db8c28",
          600: "#c4721d",
          700: "#a35819",
          800: "#84471b",
          900: "#6c3b19",
          950: "#3c1e0b",
        },
        ink: {
          50: "#f6f6f7",
          100: "#e2e3e6",
          200: "#c5c7cc",
          300: "#9ea1aa",
          400: "#777c88",
          500: "#5c616e",
          600: "#4b4f5b",
          700: "#3f424b",
          800: "#363840",
          900: "#303138",
          950: "#1e1f24",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
