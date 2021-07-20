const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTranspileModules = require('next-transpile-modules')([
  'd3-geo',
  'd3-array',
]);
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const path = require('path');

const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  /**
   * Enables react strict mode
   * https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
   */
  reactStrictMode: true,

  /**
   * Enable source maps in production, because we want people to report readable
   * stack traces from the error boundaries feature.
   */
  productionBrowserSourceMaps: true,

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
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
    };

    const duplicatePackageResolves = [
      [
        '@emotion/memoize',
        '../../node_modules/@styled-system/should-forward-prop/node_modules/@emotion/memoize',
      ],
      ['react-is', '../../node_modules/react-is'],
      [
        'unist-util-visit-parents',
        '../../node_modules/unist-util-visit-parents',
      ],
      ['d3-array', '../../node_modules/d3-geo/node_modules/d3-array'],
      ['d3-color', '../../node_modules/d3-interpolate/node_modules/d3-color'],
      ['d3-geo', '../../node_modules/d3-geo'],
      ['d3-interpolate', '../../node_modules/d3-interpolate'],
      ['balanced-match', '../../node_modules/balanced-match'],
    ];

    duplicatePackageResolves.forEach(([packageName, resolvedPath]) => {
      config.resolve.alias[packageName] = path.resolve(__dirname, resolvedPath);
    });

    config.plugins.push(
      new LodashModuleReplacementPlugin({
        // See https://github.com/lodash/lodash-webpack-plugin#feature-sets
        paths: true,
      })
    );
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new DuplicatePackageCheckerPlugin({
          verbose: true,
          showHelp: true,
        })
      );
    }

    return config;
  },
};

const plugins = [withBundleAnalyzer];

module.exports = withPlugins(plugins, withTranspileModules(nextConfig));
