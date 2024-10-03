/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,vue}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg1': "url('src/assets/background.jpg')"
      },
      backgroundColor: {
        'activeLink': 'rgba(255, 255, 255, 0.50)'
      },
      colors: {
        'custom-primary': '#7B080E',
        'custom-secondary': '#0641d8',
        'custom-tertiary': '#ffac39',
      },
      fontFamily: {
        'poppins': 'Poppins',
        'manrope': 'Manrope'
      }
    },
  },
  plugins: [],
}

