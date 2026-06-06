/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A192F',
          light: '#172A45',
          dark: '#020c1b',
        },
        slate: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
          dark: '#475569',
        },
        amber: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
          dark: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
