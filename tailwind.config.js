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
          bluep: '#001489',
          blackp: '#000000',
          grayp: '#f5f5f5',
        }
      }
    },
  },
  plugins: [],
}