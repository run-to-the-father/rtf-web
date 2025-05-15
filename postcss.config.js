// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      grid: 'no-autoplace',
      flexbox: true,
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'Safari >= 9'],
    },
  },
};
