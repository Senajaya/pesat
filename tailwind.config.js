/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pesatGreen: '#7A9A8B',
        pesatCream: '#F9F6F0',
        pesatTerracotta: '#D27D2D',
        pesatDark: '#2C3531',
      }
    },
  },
  plugins: [],
}