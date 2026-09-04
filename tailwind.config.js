/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors from original site
        brand: {
          green: '#4E9C01',
          'green-light': '#6BB833',
          'green-dark': '#3A7600',
          gold: '#F4A702',
          'gold-light': '#FFC04D',
          'gold-dark': '#C8860A',
        },
        // Warm palette additions
        terracotta: {
          50: '#FBF0ED',
          100: '#F5DDD6',
          200: '#EBBBAD',
          300: '#DE9883',
          400: '#D07650',
          500: '#BC5A36',
          600: '#A04A2C',
          700: '#7E3A23',
          800: '#5C2A1A',
          900: '#3D1C12',
        },
        olive: {
          50: '#F7F8F0',
          100: '#EDEFE0',
          200: '#DAE0C0',
          300: '#C2CE9A',
          400: '#A8B574',
          500: '#8B9E54',
          600: '#6F7E40',
          700: '#566234',
          800: '#3E4628',
          900: '#2A2F1B',
        },
        cream: {
          50: '#FEFCF7',
          100: '#FBF6EA',
          200: '#F5EAD0',
          300: '#EDDDB0',
          400: '#E4CB8E',
          500: '#D9B86E',
        },
        brick: {
          50: '#FBF2F0',
          100: '#F5DDD8',
          200: '#E8B5AC',
          300: '#D8897C',
          400: '#C45E4E',
          500: '#A8432F',
          600: '#8A3525',
          700: '#6B281D',
          800: '#4D1C15',
          900: '#33100C',
        },
      },
      fontFamily: {
        display: ['"spumoniregular"', 'serif'],
        body: ['Montserrat', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
