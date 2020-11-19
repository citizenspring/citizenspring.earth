const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    // Specify the paths to all of the template files
    content: [
      "./pages/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
    ],
    // This is the function used to extract class names from the templates
    defaultExtractor: (content) => {
      const arr = content.match(/[\w-/:]+(?<!:)/g) || [];
      arr.push("ul", "li", "pagebreak");
      return arr;
    },
  },
];
module.exports = {
  plugins: [
    "tailwindcss",
    process.env.NODE_ENV === "production" ? purgecss : undefined,
    "postcss-preset-env",
  ],
};
