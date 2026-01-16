/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Noto Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        // Primary blue accent
        primary: {
          DEFAULT: '#0d59f2',
          light: '#3b7cf5',
          dark: '#0a47c2',
          glow: 'rgba(13, 89, 242, 0.5)',
        },
        // Background colors
        background: {
          light: '#f5f6f8',
          dark: '#111318',
        },
        // Surface colors
        surface: {
          dark: '#161920',
          darker: '#111318',
          DEFAULT: '#1b1f27',
        },
        // Panel backgrounds
        panel: {
          dark: '#161920',
          DEFAULT: '#1b1f27',
          light: '#1b1f27',
          border: '#282e39',
        },
        // Border colors
        border: {
          dark: '#282e39',
        },
        // Tactical colors
        tactical: {
          bg: '#111318',
          grid: 'rgba(59, 67, 84, 0.5)',
          line: 'rgba(13, 89, 242, 0.1)',
        },
        // Status colors (unchanged - semantic)
        status: {
          want: '#22c55e',
          maybe: '#eab308',
          watch: '#3b82f6',
          no: '#ef4444',
          star: '#a855f7',
        },
        // Region colors (unchanged)
        region: {
          nal: '#3b82f6',
          eml: '#a855f7',
          sal: '#22c55e',
          apac: '#f97316',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(13, 89, 242, 0.3)',
        'glow-sm': '0 0 10px rgba(13, 89, 242, 0.2)',
        'neon': '0 0 10px rgba(13, 89, 242, 0.5), 0 0 20px rgba(13, 89, 242, 0.3)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'tactical-grid': 'radial-gradient(#3b4354 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
