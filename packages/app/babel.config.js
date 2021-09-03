module.exports = function (api) {
  return {
    presets: ['next/babel'],
    plugins: [
      'lodash',
      'date-fns',
      [
        'babel-plugin-styled-components',
        {
          ssr: true,
          pure: true,
          displayName: api.env('development'),
        },
      ],
    ],
  };
};
