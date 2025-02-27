import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // keyframes: {
      //   shimmer: {
      //     '0%': { transform: 'translateX(-100%)' },
      //     '100%': { transform: 'translateX(100%)' },
      //   },
      // },
      // animation: {
      //   shimmer: 'shimmer 2s infinite',
      // },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
