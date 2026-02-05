const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B305D', // delft-blue
          50: '#E6EBF4',
          100: '#CED7E9',
          200: '#9DAFD3',
          300: '#6D87BD',
          400: '#3C5FA7',
          500: '#1B305D', // delft-blue (main)
          600: '#152758', // space-cadet
          700: '#101D3E',
          800: '#0B1324',
          900: '#05090A',
        },
        secondary: {
          DEFAULT: '#556795', // lapis-lazuli
          50: '#F5F6F9',
          100: '#E1E4EC',
          200: '#B8BFD4',
          300: '#8F9ABC',
          400: '#6675A3',
          500: '#556795', // lapis-lazuli (main)
          600: '#414F71',
          700: '#2D374E',
          800: '#1A1F2B',
          900: '#060708',
        },
        accent: {
          DEFAULT: '#1B377D', // yale-blue
          light: '#556795', // lapis-lazuli
          dark: '#152758', // space-cadet
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        gradient: 'gradient 6s ease infinite',
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #1B305D, #556795, #1B377D)',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          'backdrop-filter': 'blur(4px)',
          border: '1px solid rgba(254, 254, 254, 0.2)',
        },
      });
    }),
  ],
};
