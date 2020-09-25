/**
 * This config enables support for CSS Grid for IE11.
 * See https://nextjs.org/docs/advanced-features/customizing-postcss-config
 */
module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
          grid: 'autoplace',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
  ],
};
