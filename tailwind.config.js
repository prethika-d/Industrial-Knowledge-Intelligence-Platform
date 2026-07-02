/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ink & paper are CSS-variable-backed so they flip with the [data-theme] attribute.
        // signal/steel/success/danger stay constant across themes (brand + status colors).
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
        },
        paper: {
          100: 'rgb(var(--paper-100) / <alpha-value>)',
          300: 'rgb(var(--paper-300) / <alpha-value>)',
          500: 'rgb(var(--paper-500) / <alpha-value>)',
        },
        // Fixed near-black — for text/icons placed on bright accent backgrounds
        // (buttons, avatars, toggle knobs) that must stay readable in BOTH themes.
        onaccent: '#14181D',
        signal: {
          400: '#FFC163',
          500: '#F5A524',
          600: '#DB8F14',
          700: '#B8730A',
        },
        steel: {
          300: '#A9D2F5',
          400: '#7DBBF0',
          500: '#4C9FE8',
          600: '#3D82C4',
        },
        success: '#3FBF7F',
        danger: '#E5484D',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        blueprint:
          'linear-gradient(rgba(76,159,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(76,159,232,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        blueprint: '28px 28px',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
