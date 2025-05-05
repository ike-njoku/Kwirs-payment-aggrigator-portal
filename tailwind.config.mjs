/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pumpkin: "rgb(255,117,24)",
        darkSurface: "#282828",
        darkBg: "#121212",
        darkMPumpkin: "#ff9551",
        darkPumpkin2: "#ff8537",
      },
      background: {
        "custom-bg": "url('')",
      },
      backgroundImage: {
        customGradient2:
          "linear-gradient( rgb(255,117,24), rgba(255,255,255,0.6))",
        customGradient:
          "linear-gradient(135deg, rgb(70,70,70) 10%, rgb(40,40,40) 100%)",
        darkCustomGradient:
          "linear-gradient(to right top, #282828, #2e2e2e, #333333, #393939, #3f3f3f)",
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};
