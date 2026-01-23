/**
 * Clerk Theme Configuration
 * Custom theme matching MelodyHub branding
 */

import type { Appearance } from '@clerk/types';

export const clerkTheme: Appearance = {
    variables: {
        // Primary brand colors - MelodyHub purple gradient
        colorPrimary: '#8b5cf6', // violet-500
        colorDanger: '#ef4444', // red-500
        colorSuccess: '#10b981', // green-500
        colorWarning: '#f59e0b', // amber-500

        // Backgrounds - Dark theme matching app
        colorBackground: '#0a0a0a', // zinc-950
        colorInputBackground: '#18181b', // zinc-900
        colorNeutral: '#27272a', // zinc-800

        // Text colors
        colorText: '#ffffff',
        colorTextSecondary: '#a1a1aa', // zinc-400
        colorTextOnPrimaryBackground: '#ffffff',

        // Borders & Radius
        borderRadius: '0.75rem', // 12px - matches app

        // Typography
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: '0.875rem', // 14px
        fontWeight: {
            normal: 400,
            medium: 500,
            bold: 600,
        },
    },

    elements: {
        // Root card - glassmorphism effect
        rootBox: 'bg-zinc-900/95 backdrop-blur-xl',
        card: 'bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-2xl',

        // Headers
        headerTitle: 'text-white text-3xl font-bold',
        headerSubtitle: 'text-zinc-400 text-base',

        // Form buttons
        formButtonPrimary: `
      bg-gradient-to-r from-violet-600 to-purple-600 
      hover:from-violet-700 hover:to-purple-700 
      text-white font-semibold 
      shadow-lg shadow-violet-500/20 
      transition-all duration-200
      hover:scale-[1.02]
      active:scale-[0.98]
    `,

        formButtonReset: `
      bg-zinc-800 hover:bg-zinc-700 
      text-white 
      border border-zinc-700
      transition-colors
    `,

        // Form fields
        formFieldInput: `
      bg-zinc-800 
      border border-zinc-700 
      text-white 
      placeholder:text-zinc-500
      focus:border-violet-500 
      focus:ring-2 
      focus:ring-violet-500/20
      transition-all
    `,

        formFieldLabel: 'text-zinc-300 font-medium text-sm',
        formFieldLabelRow: 'mb-2',

        formFieldInputShowPasswordButton: 'text-zinc-400 hover:text-white',

        // Form layout
        formResendCodeLink: 'text-violet-400 hover:text-violet-300 font-medium',

        // Divider
        dividerLine: 'bg-white/10',
        dividerText: 'text-zinc-500 text-sm',

        // Footer
        footer: 'bg-zinc-900/50',
        footerActionText: 'text-zinc-400 text-sm',
        footerActionLink: 'text-violet-400 hover:text-violet-300 font-semibold',

        // Social buttons (Google, GitHub, etc.)
        socialButtonsBlockButton: `
      bg-zinc-800 hover:bg-zinc-700 
      border border-zinc-700
      text-white
      transition-colors
      shadow-sm
    `,

        socialButtonsBlockButtonText: 'text-white font-medium',

        // Identity preview (user info display)
        identityPreview: 'bg-zinc-800 border border-zinc-700',
        identityPreviewText: 'text-white',
        identityPreviewEditButton: 'text-violet-400 hover:text-violet-300',

        // Avatar
        avatarBox: 'border-2 border-violet-500',
        avatarImage: 'rounded-full',

        // Alert/Error messages
        alert: 'bg-red-500/10 border border-red-500/20',
        alertText: 'text-red-400',

        // User profile specific
        profileSectionPrimaryButton: `
      bg-gradient-to-r from-violet-600 to-purple-600 
      hover:from-violet-700 hover:to-purple-700
      text-white
      shadow-lg shadow-violet-500/20
    `,

        profileSection: 'bg-zinc-800/50 border border-zinc-700',
        profileSectionTitle: 'text-white font-semibold',
        profileSectionTitleText: 'text-white',
        profileSectionContent: 'text-zinc-300',

        // Badges
        badge: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',

        // Navbar (in user profile)
        navbar: 'bg-zinc-900 border-b border-white/10',
        navbarButton: 'text-zinc-400 hover:text-white hover:bg-zinc-800',
        navbarButtonActive: 'text-white bg-zinc-800 border-b-2 border-violet-500',

        // Table (for sessions/devices)
        table: 'border border-zinc-700',
        tableHead: 'bg-zinc-800 text-zinc-300',
        tableBody: 'text-zinc-400',
        tableRow: 'border-b border-zinc-700 hover:bg-zinc-800/50',

        // Modal backdrop
        modalBackdrop: 'bg-black/60 backdrop-blur-sm',

        // Organization switcher
        organizationSwitcherTrigger: `
      bg-zinc-800 hover:bg-zinc-700 
      border border-zinc-700
      text-white
    `,

        organizationPreview: 'bg-zinc-800 border border-zinc-700',

        // Loading spinner
        spinner: 'border-violet-500',
    },

    layout: {
        socialButtonsPlacement: 'bottom',
        socialButtonsVariant: 'blockButton',
        showOptionalFields: true,
        logoPlacement: 'inside',
    },
};
