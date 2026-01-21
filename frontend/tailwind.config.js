/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color mapping to CSS variables
        background: {
          base: 'var(--background-base)',
          elevated: 'var(--background-elevated)',
          highlight: 'var(--background-highlight)',
          press: 'var(--background-press)',
          overlay: 'var(--background-overlay)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)',
        },
        brand: {
          primary: 'var(--primary-500)',
          secondary: 'var(--primary-400)',
          dark: 'var(--primary-900)',
          // Full palette for more control if needed
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
        },
        accent: {
          blue: 'var(--accent-blue)',
          orange: 'var(--accent-orange)',
        },
        semantic: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
          info: 'var(--info)',
        },
        // Border colors from variables
        border: {
          subtle: 'var(--border-subtle)',
          medium: 'var(--border-medium)',
          strong: 'var(--border-strong)',
        }
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.02em', // Headings default
        normal: '0em',    // Body default
        wide: '0.02em',
      },
      borderRadius: {
        sm: 'var(--radius-sm)', // 8px
        md: 'var(--radius-md)', // 12px
        lg: 'var(--radius-lg)', // 16px
        xl: 'var(--radius-xl)', // 24px
        full: 'var(--radius-full)',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.4)',
        raised: '0 8px 24px rgba(0, 0, 0, 0.5)',
        floating: '0 16px 40px rgba(0, 0, 0, 0.6)',
        modal: '0 24px 60px rgba(0, 0, 0, 0.7)',
        glow: '0 0 20px rgba(88, 86, 214, 0.5)', // Using primary brand color
      },
      transitionDuration: {
        fast: '200ms',
        DEFAULT: '300ms',
        slow: '500ms',
      },
      ringOffsetWidth: {
        3: '3px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
