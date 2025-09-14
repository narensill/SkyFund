/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
      },
      keyframes: {
        fall: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 20px' },
        },
      },
      animation: {
        fall: 'fall 1s linear infinite',
      },
    },
  },
  plugins: [],
};
