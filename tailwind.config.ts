import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        monograph: ["var(--font-roboto)"], 
      },
      backgroundImage: {
        'hero-pattern-dark': 'url("/circuit-board-dark.svg")',
        'hero-pattern-light': 'url("/circuit-board-light.svg")',
        'hideout-dark': 'url("/hideout-dark.svg")',
        'hideout-light': 'url("/hideout-light.svg")',
      },
      backgroundAttachment: {
        'fixed': 'fixed',
      },
      colors: {
        portfolio: {
          darkBlue: "#001C7C",
          lightBlue: "#0350F7",
          lightGreen: "#D1FFC2",
          snowWhite: "#edf6ff",
          white: "#fdfdfe",
        }
      }
    },
  },
  plugins: [],
};

export default config;
