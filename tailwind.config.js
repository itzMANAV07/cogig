/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17231E',
        paper: '#EEF0E9',
        surface: '#F8F9F4',
        line: '#DBDECF',
        muted: '#6B7268',
        marigold: {
          DEFAULT: '#E4A63B',
          dark: '#C68A25',
          light: '#F6E3BD',
        },
        indigo: {
          DEFAULT: '#33456B',
          dark: '#232F4A',
          light: '#DCE1EC',
        },
        success: { DEFAULT: '#3C8A5B', light: '#DCEEE2' },
        warn: { DEFAULT: '#C98A2E', light: '#F6E7CE' },
        danger: { DEFAULT: '#B4483A', light: '#F3DCD8' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};
