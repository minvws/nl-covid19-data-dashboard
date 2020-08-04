module.exports = (api) => {
  const isTest = api.env('test');

  const defaults = {
    presets: ['next/babel'],
  };

  if (isTest) {
    return {
      ...defaults,
      plugins: [
        // resolve imports correctly
        [
          'module-resolver',
          {
            root: ['./src/'],
          },
        ],
        // allow importing of SVG's in test environment
        'inline-react-svg',
      ],
    };
  }

  return defaults;
};
