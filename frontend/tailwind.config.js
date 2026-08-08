/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f6fa',
          100: '#e0ecf5',
          200: '#c0d9eb',
          300: '#92c2df',
          400: '#5da4ce',
          500: '#388ac4',
          600: '#165a9d', // CircleStore Primary Blue
          700: '#164882',
          800: '#163e6e',
          900: '#17365a',
          950: '#162535', // CircleStore Dark Navy
        },
      }
    },
  },
  plugins: [],
}