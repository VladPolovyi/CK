/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blood-red': '#8B0000',
        'blood-dark': '#4A0000',
        'blood-light': '#DC143C',
        'blood-glow': '#FF0000',
        'shadow-black': '#0A0A0A',
        'dark-gray': '#1A1A1A',
        'medium-gray': '#2D2D2D',
        'light-gray': '#404040',
        'blood-gold': '#DAA520',
        'blood-purple': '#4B0082',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blood-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2D2D2D 100%)',
        'blood-hero': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 50%, #4A0000 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blood-drip': 'blood-drip 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FF0000' },
          '100%': { boxShadow: '0 0 20px #FF0000, 0 0 30px #FF0000' },
        },
        'blood-drip': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
