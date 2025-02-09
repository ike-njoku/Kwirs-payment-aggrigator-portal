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
      },
      background: {
        "custom-bg": "url('')",
      },
      backgroundImage: {
        // customGradient:
        //   "linear-gradient(135deg, rgba(255,255,255,0.6) 0.2%, rgb(255,117,24) 100%)",
        customGradient:
          "linear-gradient(135deg, rgb(70,70,70) 10%, rgb(40,40,40) 100%)",
      },
    },
  },
  plugins: [],
};
