import rtl from 'tailwindcss-rtl'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f6fc',
          100: '#e1ecf8',
          200: '#c3d8f1',
          300: '#95bde6',
          400: '#5f9bd7',
          500: '#387dc4',
          600: '#2563ab',
          700: '#1e4f8a',
          800: '#1a4371',
          900: '#18385d',
          950: '#081225', // Deep Navy root requested
          gold: '#C5A059',
          'gold-light': '#E6D5B8',
          emerald: '#10B981',
        },
        surface: {
          DEFAULT: '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgb(8 18 37 / 0.05), 0 1px 2px -1px rgb(8 18 37 / 0.03)',
        'card-hover': '0 12px 32px -4px rgb(8 18 37 / 0.12), 0 4px 12px -2px rgb(8 18 37 / 0.06)',
        'glass': '0 8px 32px 0 rgb(8 18 37 / 0.08)',
        'glass-hover': '0 16px 40px 0 rgb(8 18 37 / 0.16)',
        'gold': '0 4px 20px -2px rgb(197 160 89 / 0.25)',
        'modal': '0 24px 80px -12px rgb(8 18 37 / 0.35)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
        pulseSubtle: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      }
    }
  },
  plugins: [rtl]
}
