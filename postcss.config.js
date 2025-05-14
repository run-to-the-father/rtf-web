// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')({
      grid: 'no-autoplace',
      flexbox: true,
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'Safari >= 9'],
    }),
  ],
};
