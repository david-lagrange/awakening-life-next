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
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
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
