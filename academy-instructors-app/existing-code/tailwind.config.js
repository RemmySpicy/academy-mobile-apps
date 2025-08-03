/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      'st': "thin_200",
      'sl': "light_300",
      'sr': "regular_400",
      'sm': "medium_500",
      'se': "semibold_600",
      'sd': "bold_700",
    },

    extend: {
      colors: {
        "faded": "#EAF4F4",
        "theme": "#4F2EC9",
        "gray-bg": "#F9F9F9",
        "input-border-gray": "#D7D7D7",
        "secondary": "#5B5F5F",
        "theme-black": "#121212",
        "label": "#9F9F9F",
        "theme-orange": "#FEAE24",
        "page-title": "#435712",
        "danger": "#EE4A52",
        "faded-danger": "#fee2e2",
        "merchant-green": "#2A8385",
        "merchant-lime": "#BFDE72",
        "faded-lime": "#F5FAEA",
        "theme-purple": "#7B21A5",
        "faded-orange": "#FFF3DD",
        "theme-green": "#12A36E"
      },
    },
  },
  plugins: [],
}

