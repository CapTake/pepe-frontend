import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        pepe: {
          "primary": "#00bde7",
                  
          "secondary": "#0080ff",
                  
          "accent": "#00f57a",
                  
          "neutral": "#0d2329",
                  
          "base-100": "#28293f",
                  
          "info": "#008cff",
                  
          "success": "#008800",
                  
          "warning": "#e1b100",
                  
          "error": "#c5001e",
        },
      },
    ],
  },
}