import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "campfire-orange": "#ff7a3c",
        "campfire-amber": "#f4b860",
        "campfire-forest": "#22543d",
        "campfire-slate": "#1f2937",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        flicker: "flicker 1.5s infinite ease-in-out",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 0.9, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
