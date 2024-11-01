// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  darkMode: 'class', // Esto es importante para el modo oscuro
  theme: {
    extend: {
      fontFamily: {
        bungee: ['Bungee', 'sans-serif'],
        satisfy: ['Satisfy', 'sans-serif'],
        merienda: ['Merienda', 'cursive'],
      },
      screens: {
        'h720': {'raw': '(min-height: 720px)'},
      },
      boxShadow: {
        orange: '0 8px 12px -4px rgba(255, 117, 24, 0.7), 0 3px 6px -2px rgba(255, 117, 24, 0.5)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        primaryAdmin: 'var(--bg-primary-admin)',
        secondaryAdmin: 'var(--bg-secondary-admin)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
    },
  },
  plugins: [],
}
