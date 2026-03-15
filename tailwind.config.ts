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
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "3xs": ["0.5625rem", { lineHeight: "0.875rem" }],
      },
      lineHeight: {
        tight: "1.2",
        editor: "1.7",
      },
      fontFamily: {
        monograph: ["var(--font-roboto)"],
      },
      backgroundImage: {
        "hero-pattern-dark": 'url("/circuit-board-dark.svg")',
        "hero-pattern-light": 'url("/circuit-board-light.svg")',
        "hideout-dark": 'url("/hideout-dark.svg")',
        "hideout-light": 'url("/hideout-light.svg")',
      },
      backgroundAttachment: {
        fixed: "fixed",
      },
      colors: {
        portfolio: {
          darkBlue: "#001C7C",
          lightBlue: "#0350F7",
          lightGreen: "#D1FFC2",
          snowWhite: "#edf6ff",
          white: "#fdfdfe",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        "accent-yellow": "hsl(var(--accent-yellow))",
        "accent-blue": "hsl(var(--accent-blue))",
        "accent-red": "hsl(var(--accent-red))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
