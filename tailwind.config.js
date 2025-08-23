/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: "#d4af37",
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        khaki: "#8b6f47",
      },
      boxShadow: {
        'elev': '0 10px 25px rgba(0,0,0,.08)',
      }
    },
  },
  safelist: [
    // کلاس‌هایی که ممکنه داینامیک ساخته شن و purge حذفشون کنه
    'bg-gradient-to-r','from-rose-400','to-amber-400',
    'hover:from-rose-500','hover:to-amber-500',
    'rounded-xl','shadow-lg','hover:shadow-xl',
    'focus:ring-2','focus:ring-rose-400'
  ],
  darkMode: ['class'],
  plugins: [],
};
