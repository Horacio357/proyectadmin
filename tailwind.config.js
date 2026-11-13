/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(15, 23, 42, 0.08), 0 4px 10px -4px rgba(14, 165, 233, 0.1)',
        popover: '0 20px 44px -10px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(148, 163, 184, 0.16)',
      },
      backdropBlur: {
        xs: '2px',
      },
      scale: {
        98: '0.98',
      },
      colors: {
        chofer: {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
        },
        mecanico: {
          light: '#fef3c7',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        inspector: {
          light: '#dcfce7',
          DEFAULT: '#16a34a',
          dark: '#15803d',
        }
      }
    },
  },
  plugins: [],
}
