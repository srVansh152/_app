/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { borderWidth: {
      '10p': '10%', // Custom border width as 10%
    },},
  },
  plugins: [],
}

