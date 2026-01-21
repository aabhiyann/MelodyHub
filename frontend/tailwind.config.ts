import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Refined Typography Scale
            fontSize: {
                // Display (Hero titles)
                'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
                'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
                'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],

                // Headings
                'heading-xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
                'heading-lg': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
                'heading-md': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
                'heading-sm': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],

                // Body
                'body-xl': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
                'body-lg': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
                'body-md': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
                'body-sm': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0' }],
                'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
            },

            // Expanded Color Palette
            colors: {
                // Brand Colors
                brand: {
                    primary: '#10b981', // emerald-500
                    secondary: '#8b5cf6', // violet-500
                    accent: '#06b6d4', // cyan-500
                },

                // Semantic Colors
                success: {
                    DEFAULT: '#10b981',
                    light: '#34d399',
                    dark: '#059669',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    light: '#fbbf24',
                    dark: '#d97706',
                },
                error: {
                    DEFAULT: '#ef4444',
                    light: '#f87171',
                    dark: '#dc2626',
                },
                info: {
                    DEFAULT: '#3b82f6',
                    light: '#60a5fa',
                    dark: '#2563eb',
                },

                // UI Colors (Zinc-based dark theme)
                background: {
                    DEFAULT: '#000000',
                    subtle: '#09090b', // zinc-950
                    muted: '#18181b', // zinc-900
                    hover: '#27272a', // zinc-800
                },
                surface: {
                    DEFAULT: '#18181b',
                    raised: '#27272a',
                    overlay: 'rgba(255, 255, 255, 0.05)',
                },
                border: {
                    DEFAULT: 'rgba(255, 255, 255, 0.1)',
                    subtle: 'rgba(255, 255, 255, 0.05)',
                    strong: 'rgba(255, 255, 255, 0.2)',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa', // zinc-400
                    tertiary: '#71717a', // zinc-500
                    disabled: '#52525b', // zinc-600
                    inverse: '#18181b',
                },
            },

            // Spacing Scale (8px base)
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '34': '8.5rem',
            },

            // Shadow System
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'md': '0 6px 16px -4px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 24px -8px rgba(0, 0, 0, 0.3), 0 6px 12px -4px rgba(0, 0, 0, 0.15)',
                'xl': '0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 8px 16px -4px rgba(0, 0, 0, 0.2)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

                // Glow effects
                'glow-sm': '0 0 10px rgba(16, 185, 129, 0.3)',
                'glow-md': '0 0 20px rgba(16, 185, 129, 0.4)',
                'glow-lg': '0 0 30px rgba(16, 185, 129, 0.5)',
            },

            // Blur Utilities
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                DEFAULT: '8px',
                md: '12px',
                lg: '16px',
                xl: '24px',
                '2xl': '40px',
                '3xl': '64px',
            },

            // Border Radius
            borderRadius: {
                'sm': '0.375rem',
                'DEFAULT': '0.5rem',
                'md': '0.625rem',
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },

            // Animation Timing
            transitionDuration: {
                '50': '50ms',
                '150': '150ms',
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
                '600': '600ms',
            },

            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
            },

            // Keyframes
            keyframes: {
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'pulse-subtle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
            },

            animation: {
                'shimmer': 'shimmer 2s infinite',
                'slide-up': 'slide-up 0.3s ease-out',
                'slide-down': 'slide-down 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },

            // Z-index Scale
            zIndex: {
                'dropdown': '1000',
                'sticky': '1100',
                'fixed': '1200',
                'modal-backdrop': '1300',
                'modal': '1400',
                'popover': '1500',
                'tooltip': '1600',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
