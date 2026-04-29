/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8e8",
          100: "#ffefc4",
          400: "#f3a63a",
          500: "#ea8d1f",
          700: "#9f4f15"
        }
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
