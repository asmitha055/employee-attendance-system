/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        ink: '#0f172a'
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(2,6,23,0.15)'
      }
    },
  },
  plugins: [],
}
