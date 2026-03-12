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
        black: "#080808",
        white: "#f2f0eb",
        cream: "#e8e4dc",
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c96a",
        },
        gray: {
          DEFAULT: "#2a2a2a",
          light: "#999",
        }
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
