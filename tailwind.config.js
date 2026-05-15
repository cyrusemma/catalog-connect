/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf6e3',
          100: '#faecc6',
          200: '#f4d48e',
          300: '#edb94a',
          400: '#d4820a',
          500: '#e8a020',
          600: '#b86d08',
          700: '#7a4706',
          800: '#5c3504',
          900: '#3d2303',
        },
        dark: {
          900: '#0f0a05',
          800: '#1a1008',
          700: '#261810',
          600: '#332010',
          500: '#4a2e14',
        },
        cream: {
          50:  '#fdf8f2',
          100: '#f9efe1',
          200: '#f5e6d0',
          300: '#e8d3ad',
          400: '#a89070',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#1da851',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      backgroundImage: {
        'amber-glow': 'radial-gradient(ellipse at 60% 30%, rgba(212,130,10,0.20) 0%, transparent 65%)',
        'amber-glow-corner': 'radial-gradient(circle at 15% 85%, rgba(232,160,32,0.12) 0%, transparent 50%)',
      },
      boxShadow: {
        'amber-glow': '0 0 20px rgba(212,130,10,0.08)',
        'amber-glow-lg': '0 0 40px rgba(212,130,10,0.15)',
        'cream-glow': '0 8px 30px rgba(212,130,10,0.10)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
    },
  },
  plugins: [],
}
