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
          bg: "#FAF8F5",       // Warm off-white
          card: "#FFFFFF",
          lavender: "#E6E2EE",  // Soft lavender
          sage: "#D8E2DC",      // Muted sage green
          sageDark: "#94A399",
          navy: "#1E2530",      // Deep midnight blue
          accent: "#8B7EC8",
          blush: "#F9EBEA",
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