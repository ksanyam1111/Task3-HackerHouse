/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        geist: {
          background: 'var(--ds-background-100)',
          surface: 'var(--ds-background-200)',
          recessed: 'var(--ds-background-300)',
          text: 'var(--ds-text-primary)',
          textSecondary: 'var(--ds-text-secondary)',
          textMuted: 'var(--ds-text-muted)',
          blue: 'var(--ds-focus-color)',
          blueFocus: 'var(--ds-focus-input-color)',
        }
      },
      boxShadow: {
        border: 'var(--ds-shadow-border)',
        small: 'var(--ds-shadow-border-small)',
        medium: 'var(--ds-shadow-border-medium)',
        large: 'var(--ds-shadow-border-large)',
        focus: 'var(--ds-focus-ring)',
        focusInput: 'var(--ds-focus-input-ring)'
      },
      borderRadius: {
        geist: 'var(--geist-radius)',
        card: 'var(--geist-marketing-radius)',
        pill: '9999px',
      },
      spacing: {
        small: 'var(--geist-space-small)',
        medium: 'var(--geist-space-medium)',
        large: 'var(--geist-space-large)',
        gap: 'var(--geist-space-gap)',
      }
    },
  },
  plugins: [],
}
