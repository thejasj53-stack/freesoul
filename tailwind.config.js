/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wellness: {
          bg: "#090b12",
          card: "#131622",
          lavender: "#b6adff",
          sage: "#9ff4dd",
          sageDark: "#a1a6bc",
          navy: "#eef0fa",
          accent: "#a99bff",
          blush: "#39202c",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(30, 37, 48, 0.05)',
        'card': '0 4px 20px -2px rgba(30, 37, 48, 0.03)',
      }
    },
  },
  plugins: [],
}
