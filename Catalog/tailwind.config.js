/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/web/src/**/*.{js,ts,jsx,tsx}",
    "./apps/admin/src/**/*.{js,ts,jsx,tsx}",
    "./packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        secondary: "#fbbf24",
        accent: "#fbbf24",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
