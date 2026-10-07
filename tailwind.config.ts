import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        line: token("line"),
        fg: token("fg"),
        muted: token("muted"),
        brand: token("brand"),
        "brand-fg": token("brand-fg"),
        danger: token("danger"),
      },
    },
  },
  plugins: [],
};

export default config;
