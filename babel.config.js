module.exports = (api) => {
  const isTest = api.env('test');

  const defaults = {
    presets: ['next/babel'],
    plugins: [
      [
        'react-intl',
        {
          extractFromFormatMessageCall: true,
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
        },
      ],
    ],
  };

  if (isTest) {
    const copy = {
      ...defaults,
    };

    // resolve imports correctly
    copy.plugins.push([
      'module-resolver',
      {
        root: ['./src/'],
      },
    ]);

    // allow importing of SVG's in test environment
    copy.plugins.push('inline-react-svg');

    return copy;
  }

  return defaults;
};
