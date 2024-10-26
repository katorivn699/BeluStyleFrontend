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
        ropaSans: ['Ropa Sans', 'san-serif'],
        inter: ['Inter', 'san-serif'],
        nunito: ['Nunito', 'san-serif']
      },
      screens: {
        'desktop-100': { 'raw': '(min-width: 1280px) and (max-width: 1865px)' },
        'desktop-125': { 'raw': '(min-width: 1601px)' },
      },
      width: {
        '3xl': "1865px",
        '2xl': "1280px"
      },
      backgroundColor: {
        'beluBlue': "#7ECCFA",
        'blueOcean' : "#177CD8",
        'blueOcean-lighter' : "#297FFD",
      },
      backgroundImage: {
        'green-to-white': 'linear-gradient(to bottom, #177CD8 50%, white 0%)',
      },
      textColor: {
        'blueOcean' : "#177CD8",
      },
      colors: {
        'blueOcean' : ""
      },
      keyframes: {
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(-10deg)' },
        },
      },
      animation: {
        ring: 'ring 0.5s ease-in-out infinite',
      },
    },
  },
  important: '#root',
  plugins: [
  ],
  daisyui: {
    themes: ["pastel", "dark"],
  },
}