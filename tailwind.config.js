/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Primary orange accent
        primary: {
          DEFAULT: '#ff6a00',
          light: '#ff8533',
          dark: '#cc5500',
          glow: 'rgba(255, 106, 0, 0.3)',
        },
        // Panel backgrounds
        panel: {
          dark: '#161616',
          DEFAULT: '#1a1a1a',
          light: '#222222',
          border: '#333333',
        },
        // Tactical colors
        tactical: {
          bg: '#0a0a0a',
          grid: 'rgba(255, 106, 0, 0.03)',
          line: 'rgba(255, 106, 0, 0.1)',
        },
        // Status colors
        status: {
          want: '#22c55e',
          maybe: '#eab308',
          watch: '#3b82f6',
          no: '#ef4444',
          star: '#a855f7',
        },
        // Region colors
        region: {
          nal: '#3b82f6',
          eml: '#a855f7',
          sal: '#22c55e',
          apac: '#f97316',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 106, 0, 0.3)',
        'glow-sm': '0 0 10px rgba(255, 106, 0, 0.2)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'tactical-grid': `
          linear-gradient(rgba(255, 106, 0, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 106, 0, 0.03) 1px, transparent 1px)
        `,
      },
    },
  },
  plugins: [],
}
