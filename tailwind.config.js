/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // <-- tambahkan ini, wajib untuk toggle manual via class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // <-- tambahkan "dark" di sini
  },
};
