import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '320px',
            'sm': '480px',
            'md': '640px',
            'lg': '768px',
            'xl': '1024px',
            '2xl': '1280px',
            '3xl': '1536px',
        },
        extend: {
            colors: {
                // Semantic color mapping to CSS variables (Liquid Glass Theme)
                brand: {
                    DEFAULT: 'var(--brand-primary)',
                    primary: 'var(--brand-primary)',
                    secondary: 'var(--brand-secondary)',
                    tertiary: 'var(--brand-tertiary)',
                    accent: 'var(--brand-accent)',
                    dark: 'var(--brand-dark)',
                },
                surface: {
                    DEFAULT: 'var(--surface-base)',
                    base: 'var(--surface-base)',
                    elevated: 'var(--surface-elevated)',
                    card: 'var(--surface-card)',
                    glass: 'var(--surface-glass)',
                    'glass-strong': 'var(--surface-glass-strong)',
                },
                // Legacy compatibility for existing components
                background: {
                    DEFAULT: 'var(--surface-base)',
                    base: 'var(--surface-base)',
                    elevated: 'var(--surface-elevated)',
                    highlight: 'var(--surface-glass)', // mapping old highlight to glass
                    press: 'var(--surface-glass-strong)',
                    overlay: 'rgba(0,0,0,0.8)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                    disabled: 'var(--text-disabled)',
                },
                semantic: {
                    success: 'var(--color-success)',
                    warning: 'var(--color-warning)',
                    error: 'var(--color-error)',
                    info: 'var(--color-info)',
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
                mono: ['var(--font-mono)', 'monospace'],
            },
            fontSize: {
                'display-lg': ['var(--text-display-lg)', { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)' }],
                'display-md': ['var(--text-display-md)', { lineHeight: '1.15', letterSpacing: 'var(--tracking-tighter)' }],
                'h1': ['var(--text-h1)', { lineHeight: '1.2', letterSpacing: 'var(--tracking-tight)' }],
                'h2': ['var(--text-h2)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
                'h3': ['var(--text-h3)', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
                'h4': ['var(--text-h4)', { lineHeight: '1.35', letterSpacing: '0em' }],
                'h5': ['var(--text-h5)', { lineHeight: '1.4', letterSpacing: '0em' }],
                'body-lg': ['var(--text-body-lg)', { lineHeight: '1.6', letterSpacing: '0em' }],
                'body': ['var(--text-body)', { lineHeight: '1.6', letterSpacing: '0em' }],
                'body-sm': ['var(--text-body-sm)', { lineHeight: '1.5', letterSpacing: '0em' }],
                'caption': ['var(--text-caption)', { lineHeight: '1.4', letterSpacing: '0.01em' }],
                'overline': ['var(--text-overline)', { lineHeight: '1.3', letterSpacing: '0.08em' }],
            },
            letterSpacing: {
                tighter: 'var(--tracking-tighter)',
                tight: 'var(--tracking-tight)',
                normal: 'var(--tracking-normal)',
                wide: 'var(--tracking-wide)',
                wider: 'var(--tracking-wider)',
            },
            spacing: {
                'xs': 'var(--space-xs)',
                'sm': 'var(--space-sm)',
                'md': 'var(--space-md)',
                'lg': 'var(--space-lg)',
                'xl': 'var(--space-xl)',
                '2xl': 'var(--space-2xl)',
                '3xl': 'var(--space-3xl)',
                '4xl': 'var(--space-4xl)',
                '5xl': 'var(--space-5xl)',
                '6xl': 'var(--space-6xl)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                full: 'var(--radius-full)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                'glow-primary': 'var(--glow-primary)',
                'glow-accent': 'var(--glow-accent)',
            },
            transitionDuration: {
                fast: 'var(--duration-fast)',
                DEFAULT: 'var(--duration-standard)',
                slow: 'var(--duration-slow)',
                glacial: 'var(--duration-glacial)',
            },
            transitionTimingFunction: {
                'in': 'var(--ease-in)',
                'out': 'var(--ease-out)',
                'in-out': 'var(--ease-in-out)',
                'bounce': 'var(--ease-bounce)',
                'smooth': 'var(--ease-smooth)',
            },
            zIndex: {
                'dropdown': '1000',
                'sticky': '1100',
                'fixed': '1200',
                'modal-backdrop': '1300',
                'modal': '1400',
                'popover': '1500',
                'tooltip': '1600',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [animate],
};

export default config;
