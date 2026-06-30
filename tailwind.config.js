/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#720303',
        'saffron-dark': '#5a0202',
        'saffron-light': '#8a1a1a',
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'serif'],
        nexa: ['"Nexa"', '"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
