import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'oi-bg': '#111417',
        'oi-surface': '#1d2023',
        'oi-surface-low': '#191c1f',
        'oi-surface-high': '#272a2e',
        'oi-surface-highest': '#323538',
        'oi-surface-bright': '#37393d',
        'oi-surface-lowest': '#0b0e12',
        'oi-cyan': '#00E5FF',
        'oi-cyan-dim': '#00daf3',
        'oi-cyan-light': '#c3f5ff',
        'oi-cyan-fixed': '#9cf0ff',
        'oi-cyan-container': '#00e5ff',
        'oi-on-cyan': '#00363d',
        'oi-outline': '#849396',
        'oi-outline-variant': '#3b494c',
        'oi-secondary': '#bbc8d0',
        'oi-secondary-container': '#3c494f',
        'oi-on-surface': '#e1e2e7',
        'oi-on-surface-variant': '#bac9cc',
        'oi-error': '#ffb4ab',
        'oi-error-container': '#93000a',
        'oi-on-error-container': '#ffdad6',
        'oi-tertiary-container': '#ffc1bd',
        'oi-on-tertiary-container': '#b01522',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
