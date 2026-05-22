/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':      'var(--bg-base)',
        'bg-surface':   'var(--bg-surface)',
        'bg-card':      'var(--bg-card)',
        'bg-card-hover':'var(--bg-card-hover)',
        'primary':      '#6366f1',
        'primary-light':'#818cf8',
        'primary-dark': '#4f46e5',
        'accent':       '#06b6d4',
        'accent-light': '#22d3ee',
        'accent-dark':  '#0891b2',
        'text-primary': 'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':   'var(--text-muted)',
        'success':      '#10b981',
        'warning':      '#f59e0b',
        'error':        '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'Cascadia Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1, #06b6d4)',
        'gradient-hero':    'linear-gradient(135deg, #1a1a4e 0%, #0a0e1a 50%, #0a1628 100%)',
      },
      animation: {
        'fade-up':     'fadeInUp 0.6s ease forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'float':       'float 4s ease-in-out infinite',
        'pulse-glow':  'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow':   'spin 10s linear infinite',
        'spin-medium': 'spin 16s linear infinite reverse',
        'spin-fast':   'spin 22s linear infinite',
        'bounce-subtle':'bounceSubtle 2s ease-in-out infinite',
        'cursor-blink':'cursorBlink 0.8s step-end infinite',
        'orb-drift':   'orbDrift 12s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(6,182,212,0.2)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        orbDrift: {
          '0%':   { transform: 'translate(0,0) scale(1)' },
          '33%':  { transform: 'translate(40px,-30px) scale(1.05)' },
          '66%':  { transform: 'translate(-20px,20px) scale(0.95)' },
          '100%': { transform: 'translate(0,0) scale(1)' },
        },
      },
      boxShadow: {
        'glow':       '0 0 40px rgba(99,102,241,0.25), 0 0 80px rgba(6,182,212,0.1)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.15)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
