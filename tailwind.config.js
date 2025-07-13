module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './index.html',
    './landing.html',
    './landing-en.html'
  ],
  theme: {
    extend: {
      colors: {
        // 保留原有的primary色彩用于兼容
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
        },
        // 新增deity神仙朋友色彩系统
        'deity-purple': '#6366f1',
        'deity-pink': '#ec4899',
        'deity-gold': '#f59e0b',
        'deity-emerald': '#10b981',
        'deity-cyan': '#06b6d4',
        'deity-indigo': '#4f46e5',
        'deity-rose': '#f43f5e',
        'deity-amber': '#f59e0b',
        'deity-teal': '#14b8a6',
        'deity-violet': '#8b5cf6',
        // 中性色
        'neutral-dark': '#0f172a',
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'chinese': ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
        // 保留原有字体
        'nunito': ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'deity-gradient': 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)',
        'deity-mesh': `
          radial-gradient(at 40% 20%, hsla(228,100%,74%,1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)
        `,
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
        'deity-glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'deity-card': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'breathGlow': 'breathGlow 8s infinite',
        'floatLotus': 'floatLotus 3s ease-in-out infinite',
        'petalPulse': 'petalPulse 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
        'particle-float': 'particle-float 6s linear infinite',
        'morphing': 'morphing 8s ease-in-out infinite',
        'shine': 'shine 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateY(-60px) rotate(240deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        breathGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        floatLotus: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
        petalPulse: {
          '0%, 100%': { opacity: '0.2', transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: '0.4', transform: 'translate(-50%, -50%) scale(1.2)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
        },
        morphing: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      }
    },
  },
  plugins: [],
}; 