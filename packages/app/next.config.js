const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTranspileModules = require('next-transpile-modules')(['d3-geo']);

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
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
    };

    config.plugins.push(
      new LodashModuleReplacementPlugin({
        // See https://github.com/lodash/lodash-webpack-plugin#feature-sets
        paths: true,
      })
    );

    return config;
  },
};

const plugins = [withBundleAnalyzer];

module.exports = withPlugins(plugins, withTranspileModules(nextConfig));
