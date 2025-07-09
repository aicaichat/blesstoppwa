module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F6AD55',
          50: '#FEF7ED',
          100: '#FDEFD8',
          200: '#FBDBB1',
          300: '#F8C78A',
          400: '#F6AD55',
          500: '#ED8936',
          600: '#DD6B20',
          700: '#C05621',
          800: '#9C4221',
          900: '#7B341E',
        }
      },
      fontFamily: {
        'sans': ['Nunito', 'ui-sans-serif', 'system-ui'],
        'chinese': ['Ma Shan Zheng', 'cursive'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}; 