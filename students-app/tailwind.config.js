/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "../shared/src/**/*.{js,jsx,ts,tsx}" // Include shared components
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Use class-based dark mode to avoid NativeWind conflicts
  theme: {
    extend: {
      colors: {
        // Academy theme colors to match your design system
        academy: {
          purple: '#4F2EC9', // Your primary brand color
          teal: '#52E2BB',   // Your secondary brand color
          black: '#121212',
          orange: '#FEAE24',
          faded: '#EAF4F4',
        },
        primary: {
          50: '#f3f0ff',
          100: '#e9e5ff',
          200: '#d6cfff',
          300: '#b8a8ff',
          400: '#9575ff',
          500: '#4F2EC9', // Academy purple
          600: '#442494',
          700: '#3a1e79',
          800: '#301866',
          900: '#261356',
        },
      },
    },
  },
  plugins: [],
}