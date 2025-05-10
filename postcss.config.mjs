/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      grid: 'no-autoplace',
      flexbox: true,
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'Safari >= 9'],
    },
  },
};

export default config;
