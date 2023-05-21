import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "tertiary-color" : "var(--tertiary-color)",
        "primary-txt":"var(--primary-txt)",
        "hovercolor":"var(--hovercolor)"
      },
    },
  },
  plugins: [],
} satisfies Config;
