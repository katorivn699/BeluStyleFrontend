/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'san-serif'],
        montserrat: ['Montserrat', 'san-serif'],
        ropaSans: ['Ropa Sans', 'san-serif']
      },
      screens: {
        'desktop-100': { 'raw': '(min-width: 1280px) and (max-width: 1865px)' },
        'desktop-125': { 'raw': '(min-width: 1601px)' },
      },
      width: {
        '3xl': "1865px",
        '2xl': "1280px"
      }
    },
  },
  plugins: [],
}