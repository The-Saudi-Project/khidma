import rtl from 'tailwindcss-rtl'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Flyajwa Green 500
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#064e3b',
          emerald: '#10B981', // The "Flyajwa" tint
        },
        surface: {
          DEFAULT: '#0B1120',
          50:  '#0f172a',
          100: '#1e293b',
          200: '#334155',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgb(11 15 26 / 0.05), 0 1px 2px -1px rgb(11 15 26 / 0.03)',
        'card-hover': '0 12px 32px -4px rgb(11 15 26 / 0.12), 0 4px 12px -2px rgb(11 15 26 / 0.06)',
        'glass': '0 8px 32px 0 rgb(11 15 26 / 0.08)',
        'glass-hover': '0 16px 40px 0 rgb(11 15 26 / 0.16)',
        'gold': '0 4px 20px -2px rgb(197 160 89 / 0.25)',
        'modal': '0 24px 80px -12px rgb(11 15 26 / 0.35)',
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
