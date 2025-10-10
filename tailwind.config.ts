// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        text: "var(--color-text)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        border: "var(--color-border)",
        surface: {
          light: "var(--color-surface-light)",
          dark: "var(--color-surface-dark)",
        },
      },
      textColor: {
        accent: "var(--color-accent)",
        text: "var(--color-text)",
        'text-muted': "var(--color-text-muted)",
        foreground: "var(--color-foreground)",
      },
      backgroundColor: {
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        'surface-light': "var(--color-surface-light)",
        'surface-dark': "var(--color-surface-dark)",
      },
      borderColor: {
        DEFAULT: "var(--color-border)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [],
};

export default config;
