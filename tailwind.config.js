/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'plastihogar': {
          blue: '#001489',
          black: '#000000',
          gray: '#f5f5f5',
        }
      }
    },
  },
  plugins: [],
}