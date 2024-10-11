// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bungee: ['Bungee', 'sans-serif'],
      },
      fontFamily: {
        satisfy: ['Satisfy', 'sans-serif'],
      },
      screens: {
        'h720': {'raw': '(min-height: 720px)'},
      },
      boxShadow: {
        orange: '0 8px 12px -4px rgba(255, 117, 24, 0.7), 0 3px 6px -2px rgba(255, 117, 24, 0.5)',
      },
    },
  },
  plugins: [],
}
