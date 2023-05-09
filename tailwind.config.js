/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6A4029',
        'primary-text': '#4F5665',
        'primary-bg': '#BCBABA',
        secondary: '#ffba33',
        'secondary-focus': '#f4a200',
        drawer: '#F2F2F2',
        quaternary: '#0b132a',
        error: '#D16B55',
        success: '#2FB390',
      },
      boxShadow: {
        'home-products': '0px 30px 60px #3939391A',
      },
      dropShadow: {
        'home-products': '0px 30px 60px 0px #3939391A',
      },
      fontFamily: {
        global: ['Poppins'],
      },
    },
  },
  plugins: [],
};
