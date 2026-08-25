/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#FAF9F6',
        'secondary-bg': '#F3EFEA',
        'brand-dark': '#4A3B32',
        'brand-deep': '#332720',
        'brand-light': '#795548',
        'accent-gold': '#C5A059',
        'accent-gold-deep': '#A8853B',
        'accent-gold-soft': '#F3E9D2',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(74, 59, 50, 0.08)',
        card: '0 6px 24px rgba(74, 59, 50, 0.07)',
        lift: '0 18px 45px rgba(74, 59, 50, 0.14)',
        gold: '0 10px 34px rgba(197, 160, 89, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        marqueeSlow: 'marquee 55s linear infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
