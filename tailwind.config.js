/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jar: { 50: '#FFF1F7', 100: '#FDE4EF', 200: '#FBC8DF', 300: '#F59BC4', 400: '#EC5FA1', 500: '#E0338A', 600: '#D01A78', 700: '#B80F68', 800: '#8F0C52', 900: '#5E0835' },
        paper: '#EFEDEE',
        side: '#F2F0F1',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        logo: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: { card: '0 2px 14px rgba(120,20,70,.08)', pop: '0 18px 50px rgba(120,20,70,.25)' },
      backgroundImage: { brand: 'linear-gradient(90deg,#C8106C 0%,#E8348F 100%)' },
    },
  },
  plugins: [],
}
