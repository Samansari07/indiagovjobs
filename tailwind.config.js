/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          50: "#F1F3F7",
          100: "#DCE1EB",
          400: "#4C5A7A",
          600: "#25314F",
          900: "#0D1626",
        },
        amber: {
          DEFAULT: "#E8A33D",
          50: "#FDF4E4",
          400: "#EFB966",
          600: "#C6832A",
        },
        verified: {
          DEFAULT: "#1F8A5F",
          50: "#E7F5EE",
        },
        closed: {
          DEFAULT: "#C4433D",
          50: "#FBEAE9",
        },
        surface: {
          DEFAULT: "#F7F8FA",
          card: "#FFFFFF",
          border: "#E4E7EC",
        },
        ink_text: {
          DEFAULT: "#1A1D23",
          muted: "#5B6472",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "72ch",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
