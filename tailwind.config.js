/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jar: {
          50: '#F9EEF2',
          100: '#F2DCE5',
          200: '#E6B8CA',
          300: '#D58BA9',
          400: '#B85F83',
          500: '#963B64',
          600: '#853253',
          700: '#702744',
          800: '#572039',
          900: '#3D1729',
        },

        paper: '#FAF8F9',
        side: '#F4EEF1',

        brand: '#853253',

        accessible: {
          text: '#243247',
          success: '#24766F',
          warning: '#A85C12',
          white: '#FFFFFF',
        },
      },

      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        logo: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },

      boxShadow: {
        card: '0 2px 14px rgba(80, 30, 55, .10)',
        pop: '0 18px 50px rgba(80, 30, 55, .20)',
      },

      backgroundImage: {
        brand: 'linear-gradient(90deg, #702744 0%, #963B64 100%)',
      },
    },
  },
  plugins: [],
}
