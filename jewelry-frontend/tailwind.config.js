/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0D14",
          900: "#12141F",
          800: "#1A1D2B",
          700: "#242838",
        },
        pearl: {
          50: "#F7F5F0",
          100: "#EFEAE0",
          200: "#E4DCCB",
        },
        gold: {
          300: "#E8D5A8",
          400: "#D9BD82",
          500: "#C9A15A",
          600: "#AD8748",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "vault-radial": "radial-gradient(circle at 50% 0%, rgba(201,161,90,0.15), transparent 60%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.25)",
        "glass-light": "0 8px 32px rgba(20,20,30,0.08)",
      },
    },
  },
  plugins: [],
}
