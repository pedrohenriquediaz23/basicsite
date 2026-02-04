/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bright-purple': '#8b5cf6',
        'bright-dark': '#0f0f1a',
      },
    },
  },
  plugins: [],
}
