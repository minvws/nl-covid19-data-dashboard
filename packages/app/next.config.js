// const withPlugins = require('next-compose-plugins');
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

const withTranspileModules = require('next-transpile-modules')([
  'lodash-es',
  'd3-scale',
  'd3-array',
  'd3-interpolate',
  'd3-format',
  'd3-time-format',
  'internmap',
]);

const nextConfig = {
  /**
   * Enables react strict mode
   * https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
   */
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        {
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                typescript: false,
                dimensions: true,
                svgo: false,
                /**
                 * Forward ref to the root SVG tag
                 */
                ref: true,
              },
            },
          ],
          issuer: /\.(js|ts)x?$/,
        },
      ],
    });

    return config;
  },
};

// const plugins = [withBundleAnalyzer];

// module.exports = withPlugins(plugins, withTranspileModules(nextConfig));

module.exports = withTranspileModules(nextConfig);
