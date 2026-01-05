// Tailwind CSS Configuration for Basho
// Extended with brand colors from design

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        basho: {
          // Earth/Brown tones (Primary)
          brown: {
            DEFAULT: '#8B6F47',
            light: '#A08860',
            dark: '#6D5836',
          },
          // Cream/Off-white backgrounds
          cream: {
            DEFAULT: '#FAF8F5',
            light: '#FFFFFF',
            dark: '#F5F5DC',
          },
          // Teal/Green (Footer and accents)
          teal: {
            DEFAULT: '#3D5A54',
            light: '#4A6B65',
            dark: '#2F4740',
          },
          // Gold accent (for headings in footer)
          gold: {
            DEFAULT: '#C9B896',
            light: '#D4C5B0',
            dark: '#B8A785',
          },
          // Text colors
          text: {
            primary: '#2C2C2C',
            secondary: '#666666',
            light: '#E5E5E5',
          },
          // Glaze colors (for product variants)
          glaze: {
            earthBrown: '#8B6F47',
            matteWhite: '#F5F5DC',
            forestGreen: '#4A7C59',
            oceanBlue: '#4A7BA7',
            sunsetOrange: '#D4825C',
            stoneGrey: '#ACA394',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 25px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;